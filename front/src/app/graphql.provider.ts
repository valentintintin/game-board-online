import { Apollo, APOLLO_OPTIONS } from 'apollo-angular';
import { HttpLink } from 'apollo-angular/http';
import { ApplicationConfig, inject } from '@angular/core';
import {ApolloClientOptions, ApolloLink, InMemoryCache, NormalizedCacheObject, split} from '@apollo/client/core';
import {environment} from "../environments/environment";
import {setContext} from "@apollo/client/link/context";
import {onError} from "@apollo/client/link/error";
import {OperationDefinitionNode} from "graphql/language";
import {getMainDefinition} from "@apollo/client/utilities";
import {GraphQLWsLink} from "@apollo/client/link/subscriptions";
import {CookieStorageService} from "../services/cookie-storage.service";
import {NzMessageService} from "ng-zorro-antd/message";
import {UtilsGraphql} from "../services/utils-graphql";
import {createClient} from "graphql-ws";
import {G} from "@angular/cdk/keycodes";

export const createApollo = (
  httpLink: HttpLink,
  cookieStorageService: CookieStorageService,
  messageService: NzMessageService
): ApolloClientOptions<NormalizedCacheObject> => {
  const auth = setContext((_operation, _context) => {
    const token = cookieStorageService.token;

    return token && (token?.length ?? 0) > 0
      ? {
        headers: {
          Authorization: `Bearer ${token}`,
          'GraphQL-Preflight': '1'
        }
      }
      : {
        headers: {
          'GraphQL-Preflight': '1'
        }
      };
  });

  const error = onError(({ graphQLErrors, networkError, operation }) => {
    if (graphQLErrors && graphQLErrors.length > 0) {
      graphQLErrors.map(({ message, locations, path }) => {
        console.warn(`[GraphQL error]: Message: ${message}, Location:`, locations, 'Path:', path);
      });

      messageService.error(graphQLErrors[0].message);
    }

    if (networkError) {
      console.warn('[Network error]', networkError);

      messageService.error(networkError.message);
    }
  });

  const http = ApolloLink.from([
    auth,
    error,
    httpLink.create({
      uri: `${environment.apiUrl}/graphql`,
      extractFiles: UtilsGraphql.extractFiles
    })
  ]);

  const ws = new GraphQLWsLink(
    createClient({
      url: `${environment.apiUrl.replace('http', 'ws')}/graphql/ws`,
      lazy: false,
      retryAttempts: Number.MAX_SAFE_INTEGER,
      retryWait: _ => new Promise((resolve) => setTimeout(resolve, 5000)), // TODO test retry
      shouldRetry: _ => true,
      connectionParams: {
        token: cookieStorageService.token
      }
    })
  );

  const link = split(
    // split based on operation type
    ({ query }) => {
      const mainDefinition = getMainDefinition(query);
      return mainDefinition.kind === 'OperationDefinition' && mainDefinition.operation === 'subscription';
    },
    ws,
    http
  );

  return {
    link,
    cache: new InMemoryCache()
  };
}

export const graphqlProvider: ApplicationConfig['providers'] = [
  Apollo,
  {
    provide: APOLLO_OPTIONS,
    useFactory: createApollo,
    deps: [HttpLink, CookieStorageService, NzMessageService]
  },
];
