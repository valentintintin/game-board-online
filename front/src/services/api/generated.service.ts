import { gql } from 'apollo-angular';
import { Injectable } from '@angular/core';
import * as Apollo from 'apollo-angular';
export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
export type MakeEmpty<T extends { [key: string]: unknown }, K extends keyof T> = { [_ in K]?: never };
export type Incremental<T> = T | { [P in keyof T]?: P extends ' $fragmentName' | '__typename' ? T[P] : never };
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: { input: string; output: string; }
  String: { input: string; output: string; }
  Boolean: { input: boolean; output: boolean; }
  Int: { input: number; output: number; }
  Float: { input: number; output: number; }
  /** The `DateTime` scalar represents an ISO-8601 compliant date time type. */
  DateTime: { input: any; output: any; }
  UUID: { input: any; output: any; }
};

export enum ApplyPolicy {
  AfterResolver = 'AFTER_RESOLVER',
  BeforeResolver = 'BEFORE_RESOLVER',
  Validation = 'VALIDATION'
}

export type ChatMessage = {
  __typename?: 'ChatMessage';
  createdAt: Scalars['DateTime']['output'];
  id: Scalars['UUID']['output'];
  name: Scalars['String']['output'];
  room: Room;
  user?: Maybe<User>;
};

export type ChatMessageSortInput = {
  createdAt?: InputMaybe<SortEnumType>;
  id?: InputMaybe<SortEnumType>;
  name?: InputMaybe<SortEnumType>;
  room?: InputMaybe<RoomSortInput>;
  user?: InputMaybe<UserSortInput>;
};

export enum CodeNamesAction {
  GiveHint = 'GIVE_HINT',
  MakeProposal = 'MAKE_PROPOSAL',
  Pass = 'PASS',
  Reset = 'RESET'
}

export type CodeNamesGame = {
  __typename?: 'CodeNamesGame';
  createdAt: Scalars['DateTime']['output'];
  currentPlayer?: Maybe<Player>;
  currentState?: Maybe<CodeNamesState>;
  currentTeam?: Maybe<CodeNamesTeam>;
  hints: Array<CodeNamesHint>;
  id: Scalars['UUID']['output'];
  name: Scalars['String']['output'];
  players: Array<CodeNamesPlayer>;
  room: Room;
  state?: Maybe<Scalars['String']['output']>;
  teamBeginning: CodeNamesTeam;
  type: Scalars['String']['output'];
  winnerPlayer?: Maybe<Player>;
  winnerTeam?: Maybe<CodeNamesTeam>;
  words: Array<CodeNamesWordCard>;
};

export type CodeNamesGiveHintEventRequestInput = {
  hint: Scalars['String']['input'];
  nb: Scalars['Int']['input'];
  type: HintType;
};

export type CodeNamesHint = {
  __typename?: 'CodeNamesHint';
  createdAt: Scalars['DateTime']['output'];
  game: Game;
  id: Scalars['UUID']['output'];
  name: Scalars['String']['output'];
  nb: Scalars['Int']['output'];
  owner?: Maybe<Player>;
  team: CodeNamesTeam;
  type: HintType;
  word: Scalars['String']['output'];
};

export type CodeNamesMakeProposalEventRequestInput = {
  hintId?: InputMaybe<Scalars['UUID']['input']>;
  word: Scalars['String']['input'];
};

export type CodeNamesMutations = {
  __typename?: 'CodeNamesMutations';
  create?: Maybe<CodeNamesGame>;
  giveHint?: Maybe<EventResponseOfCodeNamesGameAndCodeNamesPlayerAndCodeNamesActionAndCodeNamesHint>;
  makeProposal?: Maybe<EventResponseOfCodeNamesGameAndCodeNamesPlayerAndCodeNamesActionAndCodeNamesWordCard>;
  reset?: Maybe<EventResponseOfCodeNamesGameAndCodeNamesPlayerAndCodeNamesActionAndObject>;
};


export type CodeNamesMutationsCreateArgs = {
  roomId: Scalars['UUID']['input'];
};


export type CodeNamesMutationsGiveHintArgs = {
  data: CodeNamesGiveHintEventRequestInput;
  gameId: Scalars['UUID']['input'];
};


export type CodeNamesMutationsMakeProposalArgs = {
  data: CodeNamesMakeProposalEventRequestInput;
  gameId: Scalars['UUID']['input'];
};


export type CodeNamesMutationsResetArgs = {
  roomId: Scalars['UUID']['input'];
};

export type CodeNamesPlayer = {
  __typename?: 'CodeNamesPlayer';
  game: Game;
  id: Scalars['UUID']['output'];
  isGuesser: Scalars['Boolean']['output'];
  name: Scalars['String']['output'];
  team: CodeNamesTeam;
  user: User;
};

export type CodeNamesQuery = {
  __typename?: 'CodeNamesQuery';
  get?: Maybe<CodeNamesGame>;
};


export type CodeNamesQueryGetArgs = {
  gameId: Scalars['UUID']['input'];
};

export enum CodeNamesState {
  End = 'END',
  Hint = 'HINT',
  LastProposal = 'LAST_PROPOSAL',
  Proposal = 'PROPOSAL'
}

export enum CodeNamesTeam {
  Black = 'BLACK',
  Blue = 'BLUE',
  Neutral = 'NEUTRAL',
  Red = 'RED'
}

export type CodeNamesWordCard = {
  __typename?: 'CodeNamesWordCard';
  allowFlipOnce: Scalars['Boolean']['output'];
  canBeDeleted: Scalars['Boolean']['output'];
  canBeShownToOthers: Scalars['Boolean']['output'];
  canFlip: Scalars['Boolean']['output'];
  canMove: Scalars['Boolean']['output'];
  canRotate: Scalars['Boolean']['output'];
  game: Game;
  height: Scalars['Int']['output'];
  id: Scalars['UUID']['output'];
  image: Scalars['String']['output'];
  imageBack?: Maybe<Scalars['String']['output']>;
  isFound: Scalars['Boolean']['output'];
  lastActorTouched?: Maybe<Player>;
  name: Scalars['String']['output'];
  onlyForOwner: Scalars['Boolean']['output'];
  owner?: Maybe<Player>;
  rotation: Scalars['Int']['output'];
  shadowColor?: Maybe<Scalars['String']['output']>;
  showBack: Scalars['Boolean']['output'];
  team?: Maybe<CodeNamesTeam>;
  width: Scalars['Int']['output'];
  word: Scalars['String']['output'];
  x: Scalars['Int']['output'];
  y: Scalars['Int']['output'];
};

export type EventResponseOfCodeNamesGameAndCodeNamesPlayerAndCodeNamesActionAndCodeNamesHint = {
  __typename?: 'EventResponseOfCodeNamesGameAndCodeNamesPlayerAndCodeNamesActionAndCodeNamesHint';
  action: CodeNamesAction;
  data?: Maybe<CodeNamesHint>;
  game: CodeNamesGame;
  player: CodeNamesPlayer;
};

export type EventResponseOfCodeNamesGameAndCodeNamesPlayerAndCodeNamesActionAndCodeNamesWordCard = {
  __typename?: 'EventResponseOfCodeNamesGameAndCodeNamesPlayerAndCodeNamesActionAndCodeNamesWordCard';
  action: CodeNamesAction;
  data?: Maybe<CodeNamesWordCard>;
  game: CodeNamesGame;
  player: CodeNamesPlayer;
};

export type EventResponseOfCodeNamesGameAndCodeNamesPlayerAndCodeNamesActionAndObject = {
  __typename?: 'EventResponseOfCodeNamesGameAndCodeNamesPlayerAndCodeNamesActionAndObject';
  action: CodeNamesAction;
  game: CodeNamesGame;
  player: CodeNamesPlayer;
};

export type Game = {
  __typename?: 'Game';
  createdAt: Scalars['DateTime']['output'];
  id: Scalars['UUID']['output'];
  name: Scalars['String']['output'];
  players: Array<Player>;
  type: Scalars['String']['output'];
};

export type GameSortInput = {
  createdAt?: InputMaybe<SortEnumType>;
  currentPlayer?: InputMaybe<PlayerSortInput>;
  id?: InputMaybe<SortEnumType>;
  name?: InputMaybe<SortEnumType>;
  room?: InputMaybe<RoomSortInput>;
  state?: InputMaybe<SortEnumType>;
  type?: InputMaybe<SortEnumType>;
  winnerPlayer?: InputMaybe<PlayerSortInput>;
};

export enum HintType {
  Infinite = 'INFINITE',
  Nb = 'NB',
  Zero = 'ZERO'
}

export type Mutation = {
  __typename?: 'Mutation';
  codeNames: CodeNamesMutations;
  createRoom?: Maybe<Room>;
  joinRoom?: Maybe<Room>;
  leaveRoom?: Maybe<Room>;
  login?: Maybe<User>;
  sendChatMessage?: Maybe<ChatMessage>;
};


export type MutationCreateRoomArgs = {
  name: Scalars['String']['input'];
};


export type MutationJoinRoomArgs = {
  roomId: Scalars['UUID']['input'];
};


export type MutationLeaveRoomArgs = {
  roomId: Scalars['UUID']['input'];
};


export type MutationLoginArgs = {
  color: Scalars['String']['input'];
  name: Scalars['String']['input'];
};


export type MutationSendChatMessageArgs = {
  message: Scalars['String']['input'];
  roomId: Scalars['UUID']['input'];
};

export type Player = {
  __typename?: 'Player';
  game: Game;
  id: Scalars['UUID']['output'];
  name: Scalars['String']['output'];
  user: User;
};

export type PlayerSortInput = {
  game?: InputMaybe<GameSortInput>;
  id?: InputMaybe<SortEnumType>;
  name?: InputMaybe<SortEnumType>;
  user?: InputMaybe<UserSortInput>;
};

export type Query = {
  __typename?: 'Query';
  codeNames: CodeNamesQuery;
  me?: Maybe<User>;
  room?: Maybe<Room>;
  rooms: Array<Room>;
};


export type QueryRoomArgs = {
  roomId: Scalars['UUID']['input'];
};

export type Room = {
  __typename?: 'Room';
  chatMessages: Array<ChatMessage>;
  createdAt: Scalars['DateTime']['output'];
  currentGame?: Maybe<Game>;
  games: Array<Game>;
  id: Scalars['UUID']['output'];
  name: Scalars['String']['output'];
  owner: User;
  users: Array<User>;
};


export type RoomChatMessagesArgs = {
  order?: InputMaybe<Array<ChatMessageSortInput>>;
};

export type RoomSortInput = {
  createdAt?: InputMaybe<SortEnumType>;
  currentGame?: InputMaybe<GameSortInput>;
  id?: InputMaybe<SortEnumType>;
  name?: InputMaybe<SortEnumType>;
  owner?: InputMaybe<UserSortInput>;
};

export enum SortEnumType {
  Asc = 'ASC',
  Desc = 'DESC'
}

export type Subscription = {
  __typename?: 'Subscription';
  chatMessage?: Maybe<ChatMessage>;
  giveHint: EventResponseOfCodeNamesGameAndCodeNamesPlayerAndCodeNamesActionAndCodeNamesHint;
  makeProposal: EventResponseOfCodeNamesGameAndCodeNamesPlayerAndCodeNamesActionAndCodeNamesWordCard;
  reset: EventResponseOfCodeNamesGameAndCodeNamesPlayerAndCodeNamesActionAndObject;
};

export type User = {
  __typename?: 'User';
  color: Scalars['String']['output'];
  createdAt: Scalars['DateTime']['output'];
  id: Scalars['UUID']['output'];
  name: Scalars['String']['output'];
  players: Array<Player>;
  roomsCreated: Array<Room>;
  token?: Maybe<Scalars['String']['output']>;
};

export type UserSortInput = {
  color?: InputMaybe<SortEnumType>;
  createdAt?: InputMaybe<SortEnumType>;
  id?: InputMaybe<SortEnumType>;
  name?: InputMaybe<SortEnumType>;
};

export type GiveHintQueryMutationVariables = Exact<{
  gameId: Scalars['UUID']['input'];
  hint: Scalars['String']['input'];
  nb: Scalars['Int']['input'];
  type: HintType;
}>;


export type GiveHintQueryMutation = { __typename?: 'Mutation', codeNames: { __typename?: 'CodeNamesMutations', giveHint?: { __typename?: 'EventResponseOfCodeNamesGameAndCodeNamesPlayerAndCodeNamesActionAndCodeNamesHint', action: CodeNamesAction } | null } };

export type GetCodeNamesQueryVariables = Exact<{
  gameId: Scalars['UUID']['input'];
}>;


export type GetCodeNamesQuery = { __typename?: 'Query', codeNames: { __typename?: 'CodeNamesQuery', get?: { __typename?: 'CodeNamesGame', id: any, currentState?: CodeNamesState | null, currentTeam?: CodeNamesTeam | null, winnerTeam?: CodeNamesTeam | null, currentPlayer?: { __typename?: 'Player', id: any, name: string } | null, players: Array<{ __typename?: 'CodeNamesPlayer', id: any, name: string, team: CodeNamesTeam }>, words: Array<{ __typename?: 'CodeNamesWordCard', id: any, word: string, team?: CodeNamesTeam | null, isFound: boolean }>, hints: Array<{ __typename?: 'CodeNamesHint', id: any, team: CodeNamesTeam, word: string, nb: number, owner?: { __typename?: 'Player', id: any, name: string } | null }> } | null } };

export type CodeNameMakeProposalMutationVariables = Exact<{
  gameId: Scalars['UUID']['input'];
  word: Scalars['String']['input'];
}>;


export type CodeNameMakeProposalMutation = { __typename?: 'Mutation', codeNames: { __typename?: 'CodeNamesMutations', makeProposal?: { __typename?: 'EventResponseOfCodeNamesGameAndCodeNamesPlayerAndCodeNamesActionAndCodeNamesWordCard', action: CodeNamesAction } | null } };

export type SendMessageMutationVariables = Exact<{
  roomId: Scalars['UUID']['input'];
  message: Scalars['String']['input'];
}>;


export type SendMessageMutation = { __typename?: 'Mutation', sendChatMessage?: { __typename?: 'ChatMessage', id: any } | null };

export type GetMessagesQueryVariables = Exact<{
  roomId: Scalars['UUID']['input'];
}>;


export type GetMessagesQuery = { __typename?: 'Query', room?: { __typename?: 'Room', id: any, chatMessages: Array<{ __typename?: 'ChatMessage', id: any, createdAt: any, name: string, user?: { __typename?: 'User', id: any, name: string, color: string } | null }> } | null };

export type RoomsQueryVariables = Exact<{ [key: string]: never; }>;


export type RoomsQuery = { __typename?: 'Query', rooms: Array<{ __typename?: 'Room', id: any, name: string, createdAt: any, owner: { __typename?: 'User', id: any, name: string }, users: Array<{ __typename?: 'User', id: any, name: string }>, currentGame?: { __typename?: 'Game', id: any, name: string } | null }> };

export type LoginMutationVariables = Exact<{
  name: Scalars['String']['input'];
  color: Scalars['String']['input'];
}>;


export type LoginMutation = { __typename?: 'Mutation', login?: { __typename?: 'User', id: any, name: string, color: string, token?: string | null } | null };

export type MeQueryVariables = Exact<{ [key: string]: never; }>;


export type MeQuery = { __typename?: 'Query', me?: { __typename?: 'User', id: any, name: string, color: string } | null };

export const GiveHintQueryDocument = gql`
    mutation giveHintQuery($gameId: UUID!, $hint: String!, $nb: Int!, $type: HintType!) {
  codeNames {
    giveHint(gameId: $gameId, data: {hint: $hint, nb: $nb, type: $type}) {
      action
    }
  }
}
    `;

  @Injectable({
    providedIn: 'root'
  })
  export class GiveHintQueryGQL extends Apollo.Mutation<GiveHintQueryMutation, GiveHintQueryMutationVariables> {
    override document = GiveHintQueryDocument;
    
    constructor(apollo: Apollo.Apollo) {
      super(apollo);
    }
  }
export const GetCodeNamesDocument = gql`
    query getCodeNames($gameId: UUID!) {
  codeNames {
    get(gameId: $gameId) {
      id
      currentState
      currentTeam
      winnerTeam
      currentPlayer {
        id
        name
      }
      players {
        id
        name
        team
      }
      words {
        id
        word
        team
        isFound
      }
      hints {
        id
        team
        word
        nb
        owner {
          id
          name
        }
      }
    }
  }
}
    `;

  @Injectable({
    providedIn: 'root'
  })
  export class GetCodeNamesGQL extends Apollo.Query<GetCodeNamesQuery, GetCodeNamesQueryVariables> {
    override document = GetCodeNamesDocument;
    
    constructor(apollo: Apollo.Apollo) {
      super(apollo);
    }
  }
export const CodeNameMakeProposalDocument = gql`
    mutation codeNameMakeProposal($gameId: UUID!, $word: String!) {
  codeNames {
    makeProposal(gameId: $gameId, data: {word: $word}) {
      action
    }
  }
}
    `;

  @Injectable({
    providedIn: 'root'
  })
  export class CodeNameMakeProposalGQL extends Apollo.Mutation<CodeNameMakeProposalMutation, CodeNameMakeProposalMutationVariables> {
    override document = CodeNameMakeProposalDocument;
    
    constructor(apollo: Apollo.Apollo) {
      super(apollo);
    }
  }
export const SendMessageDocument = gql`
    mutation sendMessage($roomId: UUID!, $message: String!) {
  sendChatMessage(roomId: $roomId, message: $message) {
    id
  }
}
    `;

  @Injectable({
    providedIn: 'root'
  })
  export class SendMessageGQL extends Apollo.Mutation<SendMessageMutation, SendMessageMutationVariables> {
    override document = SendMessageDocument;
    
    constructor(apollo: Apollo.Apollo) {
      super(apollo);
    }
  }
export const GetMessagesDocument = gql`
    query getMessages($roomId: UUID!) {
  room(roomId: $roomId) {
    id
    chatMessages(order: {createdAt: DESC}) {
      id
      createdAt
      name
      user {
        id
        name
        color
      }
    }
  }
}
    `;

  @Injectable({
    providedIn: 'root'
  })
  export class GetMessagesGQL extends Apollo.Query<GetMessagesQuery, GetMessagesQueryVariables> {
    override document = GetMessagesDocument;
    
    constructor(apollo: Apollo.Apollo) {
      super(apollo);
    }
  }
export const RoomsDocument = gql`
    query rooms {
  rooms {
    id
    name
    createdAt
    owner {
      id
      name
    }
    users {
      id
      name
    }
    currentGame {
      id
      name
    }
  }
}
    `;

  @Injectable({
    providedIn: 'root'
  })
  export class RoomsGQL extends Apollo.Query<RoomsQuery, RoomsQueryVariables> {
    override document = RoomsDocument;
    
    constructor(apollo: Apollo.Apollo) {
      super(apollo);
    }
  }
export const LoginDocument = gql`
    mutation login($name: String!, $color: String!) {
  login(name: $name, color: $color) {
    id
    name
    color
    token
  }
}
    `;

  @Injectable({
    providedIn: 'root'
  })
  export class LoginGQL extends Apollo.Mutation<LoginMutation, LoginMutationVariables> {
    override document = LoginDocument;
    
    constructor(apollo: Apollo.Apollo) {
      super(apollo);
    }
  }
export const MeDocument = gql`
    query me {
  me {
    id
    name
    color
  }
}
    `;

  @Injectable({
    providedIn: 'root'
  })
  export class MeGQL extends Apollo.Query<MeQuery, MeQueryVariables> {
    override document = MeDocument;
    
    constructor(apollo: Apollo.Apollo) {
      super(apollo);
    }
  }