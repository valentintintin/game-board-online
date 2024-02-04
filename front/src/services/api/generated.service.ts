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
  /** The `Long` scalar type represents non-fractional signed whole 64-bit numeric values. Long can represent values between -(2^63) and 2^63 - 1. */
  Long: { input: any; output: any; }
};

export enum ApplyPolicy {
  AfterResolver = 'AFTER_RESOLVER',
  BeforeResolver = 'BEFORE_RESOLVER',
  Validation = 'VALIDATION'
}

export type ChatMessage = {
  __typename?: 'ChatMessage';
  createdAt: Scalars['DateTime']['output'];
  id: Scalars['Long']['output'];
  name: Scalars['String']['output'];
  room: Room;
  roomId: Scalars['Long']['output'];
  user?: Maybe<User>;
};

export type ChatMessageSortInput = {
  createdAt?: InputMaybe<SortEnumType>;
  id?: InputMaybe<SortEnumType>;
  name?: InputMaybe<SortEnumType>;
  room?: InputMaybe<RoomSortInput>;
  roomId?: InputMaybe<SortEnumType>;
  user?: InputMaybe<UserSortInput>;
};

export type Entity = {
  __typename?: 'Entity';
  allowFlipOnce: Scalars['Boolean']['output'];
  canBeDeleted: Scalars['Boolean']['output'];
  canFlip: Scalars['Boolean']['output'];
  canMove: Scalars['Boolean']['output'];
  canRotate: Scalars['Boolean']['output'];
  deleteWithLink: Scalars['Boolean']['output'];
  entitiesLinked: Array<Entity>;
  group: EntityGroup;
  groupId: Scalars['Long']['output'];
  height: Scalars['Int']['output'];
  id: Scalars['Long']['output'];
  image?: Maybe<Scalars['String']['output']>;
  imageBack?: Maybe<Scalars['String']['output']>;
  linkTo?: Maybe<Entity>;
  linkToId?: Maybe<Scalars['Long']['output']>;
  moveWithLink: Scalars['Boolean']['output'];
  name: Scalars['String']['output'];
  onlyForOwner: Scalars['Boolean']['output'];
  order: Scalars['Int']['output'];
  rotation: Scalars['Int']['output'];
  showBack: Scalars['Boolean']['output'];
  width: Scalars['Int']['output'];
  x: Scalars['Int']['output'];
  y: Scalars['Int']['output'];
};

export enum EntityFlippableState {
  NotFlippable = 'NOT_FLIPPABLE',
  NotShowBack = 'NOT_SHOW_BACK',
  OnlyForOwnerIsMineNotShowBack = 'ONLY_FOR_OWNER_IS_MINE_NOT_SHOW_BACK',
  OnlyForOwnerIsMineShowBack = 'ONLY_FOR_OWNER_IS_MINE_SHOW_BACK',
  OnlyForOwnerShowBack = 'ONLY_FOR_OWNER_SHOW_BACK',
  ShowBack = 'SHOW_BACK'
}

export type EntityGroup = {
  __typename?: 'EntityGroup';
  canRemoveNotUsed: Scalars['Boolean']['output'];
  entities: Array<Entity>;
  game: Game;
  gameId: Scalars['Long']['output'];
  id: Scalars['Long']['output'];
  imageBack?: Maybe<Scalars['String']['output']>;
  name: Scalars['String']['output'];
  numberToGiveToPlayer: Scalars['Int']['output'];
  randomize: Scalars['Boolean']['output'];
};

export type EntityPlayed = {
  __typename?: 'EntityPlayed';
  canBeDeleted: Scalars['Boolean']['output'];
  canBeGiven: Scalars['Boolean']['output'];
  canFlip: EntityFlippableState;
  canMove: Scalars['Boolean']['output'];
  canRotate: Scalars['Boolean']['output'];
  container?: Maybe<Scalars['String']['output']>;
  createdAt: Scalars['DateTime']['output'];
  deleted: Scalars['Boolean']['output'];
  entitiesLinked: Array<EntityPlayed>;
  entity: Entity;
  entityId: Scalars['Long']['output'];
  gamePlayed: GamePlayed;
  gamePlayedId: Scalars['Long']['output'];
  height: Scalars['Int']['output'];
  id: Scalars['Long']['output'];
  image?: Maybe<Scalars['String']['output']>;
  imageBack?: Maybe<Scalars['String']['output']>;
  isInMainContainer: Scalars['Boolean']['output'];
  isMine: Scalars['Boolean']['output'];
  lastActorTouched?: Maybe<Player>;
  lastActorTouchedId?: Maybe<Scalars['Long']['output']>;
  linkTo?: Maybe<EntityPlayed>;
  linkToId?: Maybe<Scalars['Long']['output']>;
  name?: Maybe<Scalars['String']['output']>;
  onlyForOwner: Scalars['Boolean']['output'];
  order: Scalars['Int']['output'];
  owner?: Maybe<Player>;
  ownerId?: Maybe<Scalars['Long']['output']>;
  rotation: Scalars['Int']['output'];
  showBack: Scalars['Boolean']['output'];
  width: Scalars['Int']['output'];
  x: Scalars['Int']['output'];
  y: Scalars['Int']['output'];
};

export type EntityUpdateDtoInput = {
  rotation: Scalars['Int']['input'];
  showBack: Scalars['Boolean']['input'];
  x: Scalars['Int']['input'];
  y: Scalars['Int']['input'];
};

export type Game = {
  __typename?: 'Game';
  entitiesGroups: Array<EntityGroup>;
  id: Scalars['Long']['output'];
  image?: Maybe<Scalars['String']['output']>;
  minPlayers: Scalars['Int']['output'];
  name: Scalars['String']['output'];
  type: Scalars['String']['output'];
};

export type GamePlayed = {
  __typename?: 'GamePlayed';
  createdAt: Scalars['DateTime']['output'];
  entities?: Maybe<Array<Maybe<EntityPlayed>>>;
  entitiesGroups?: Maybe<Array<Maybe<EntityGroup>>>;
  game: Game;
  gameId: Scalars['Long']['output'];
  id: Scalars['Long']['output'];
  isFinished: Scalars['Boolean']['output'];
  players: Array<Player>;
  room: Room;
  roomId: Scalars['Long']['output'];
};

export type GamePlayedSortInput = {
  createdAt?: InputMaybe<SortEnumType>;
  game?: InputMaybe<GameSortInput>;
  gameId?: InputMaybe<SortEnumType>;
  id?: InputMaybe<SortEnumType>;
  isFinished?: InputMaybe<SortEnumType>;
  room?: InputMaybe<RoomSortInput>;
  roomId?: InputMaybe<SortEnumType>;
};

export type GameSortInput = {
  enabled?: InputMaybe<SortEnumType>;
  id?: InputMaybe<SortEnumType>;
  image?: InputMaybe<SortEnumType>;
  minPlayers?: InputMaybe<SortEnumType>;
  name?: InputMaybe<SortEnumType>;
  type?: InputMaybe<SortEnumType>;
};

export type Mutation = {
  __typename?: 'Mutation';
  createRoom?: Maybe<Room>;
  deleteEntitiesNotTouched: Array<EntityPlayed>;
  endGame?: Maybe<GamePlayed>;
  gameDeleteEntity: EntityPlayed;
  gameFlipEntity: EntityPlayed;
  gameGiveEntity: EntityPlayed;
  gameMoveEntity: EntityPlayed;
  gameRotateEntity: EntityPlayed;
  initializeGame?: Maybe<GamePlayed>;
  joinRoom?: Maybe<Room>;
  leaveRoom?: Maybe<Room>;
  login?: Maybe<User>;
  randomizeEntities: Array<EntityPlayed>;
  sendChatMessage?: Maybe<ChatMessage>;
  setCurrentGame?: Maybe<Room>;
  updateEntity: Array<Entity>;
};


export type MutationCreateRoomArgs = {
  name: Scalars['String']['input'];
};


export type MutationDeleteEntitiesNotTouchedArgs = {
  entityGroupId: Scalars['Long']['input'];
  gamePlayedId: Scalars['Long']['input'];
};


export type MutationEndGameArgs = {
  gamePlayedId: Scalars['Long']['input'];
};


export type MutationGameDeleteEntityArgs = {
  entityPlayedId: Scalars['Long']['input'];
};


export type MutationGameFlipEntityArgs = {
  entityPlayedId: Scalars['Long']['input'];
  onlyForOwner?: InputMaybe<Scalars['Boolean']['input']>;
  showBack: Scalars['Boolean']['input'];
};


export type MutationGameGiveEntityArgs = {
  container?: InputMaybe<Scalars['String']['input']>;
  entityPlayedId: Scalars['Long']['input'];
  newPlayerId: Scalars['Long']['input'];
};


export type MutationGameMoveEntityArgs = {
  container?: InputMaybe<Scalars['String']['input']>;
  entityPlayedId: Scalars['Long']['input'];
  x: Scalars['Int']['input'];
  y: Scalars['Int']['input'];
};


export type MutationGameRotateEntityArgs = {
  entityPlayedId: Scalars['Long']['input'];
  rotation: Scalars['Int']['input'];
};


export type MutationInitializeGameArgs = {
  gameId: Scalars['Long']['input'];
  roomId: Scalars['Long']['input'];
};


export type MutationJoinRoomArgs = {
  roomId: Scalars['Long']['input'];
};


export type MutationLeaveRoomArgs = {
  roomId: Scalars['Long']['input'];
  userId: Scalars['Long']['input'];
};


export type MutationLoginArgs = {
  color: Scalars['String']['input'];
  name: Scalars['String']['input'];
};


export type MutationRandomizeEntitiesArgs = {
  entityGroupId: Scalars['Long']['input'];
  gamePlayedId: Scalars['Long']['input'];
  onlyTouched: Scalars['Boolean']['input'];
  restoreDeleted: Scalars['Boolean']['input'];
};


export type MutationSendChatMessageArgs = {
  message: Scalars['String']['input'];
  roomId: Scalars['Long']['input'];
};


export type MutationSetCurrentGameArgs = {
  gamePlayedId: Scalars['Long']['input'];
};


export type MutationUpdateEntityArgs = {
  dto: EntityUpdateDtoInput;
  entityId: Scalars['Long']['input'];
};

export type Player = {
  __typename?: 'Player';
  game: GamePlayed;
  gameId: Scalars['Long']['output'];
  id: Scalars['Long']['output'];
  user: User;
  userId: Scalars['Long']['output'];
};

export type Query = {
  __typename?: 'Query';
  game?: Maybe<Game>;
  gamePlayed?: Maybe<GamePlayed>;
  games: Array<Game>;
  me?: Maybe<User>;
  room?: Maybe<Room>;
  rooms: Array<Room>;
};


export type QueryGameArgs = {
  gameId: Scalars['Long']['input'];
};


export type QueryGamePlayedArgs = {
  gamePlayedId: Scalars['Long']['input'];
};


export type QueryGamesArgs = {
  order?: InputMaybe<Array<GameSortInput>>;
};


export type QueryRoomArgs = {
  roomId: Scalars['Long']['input'];
};


export type QueryRoomsArgs = {
  order?: InputMaybe<Array<RoomSortInput>>;
};

export type Room = {
  __typename?: 'Room';
  chatMessages: Array<ChatMessage>;
  createdAt: Scalars['DateTime']['output'];
  currentGame?: Maybe<GamePlayed>;
  currentGameId?: Maybe<Scalars['Long']['output']>;
  games: Array<GamePlayed>;
  id: Scalars['Long']['output'];
  name: Scalars['String']['output'];
  owner: User;
  ownerId: Scalars['Long']['output'];
  userConnectedIsInside: Scalars['Boolean']['output'];
  userConnectedIsOwner: Scalars['Boolean']['output'];
  users: Array<User>;
};


export type RoomChatMessagesArgs = {
  order?: InputMaybe<Array<ChatMessageSortInput>>;
};


export type RoomGamesArgs = {
  order?: InputMaybe<Array<GamePlayedSortInput>>;
};


export type RoomUsersArgs = {
  order?: InputMaybe<Array<UserSortInput>>;
};

export type RoomSortInput = {
  createdAt?: InputMaybe<SortEnumType>;
  currentGame?: InputMaybe<GamePlayedSortInput>;
  currentGameId?: InputMaybe<SortEnumType>;
  id?: InputMaybe<SortEnumType>;
  name?: InputMaybe<SortEnumType>;
  owner?: InputMaybe<UserSortInput>;
  ownerId?: InputMaybe<SortEnumType>;
};

export enum SortEnumType {
  Asc = 'ASC',
  Desc = 'DESC'
}

export type Subscription = {
  __typename?: 'Subscription';
  chatMessage?: Maybe<ChatMessage>;
  gameAction?: Maybe<EntityPlayed>;
  newRoom?: Maybe<Room>;
  roomAction?: Maybe<Room>;
};

export type User = {
  __typename?: 'User';
  color: Scalars['String']['output'];
  createdAt: Scalars['DateTime']['output'];
  id: Scalars['Long']['output'];
  joinedRooms: Array<Room>;
  name: Scalars['String']['output'];
  roomsCreated: Array<Room>;
  token?: Maybe<Scalars['String']['output']>;
};

export type UserSortInput = {
  color?: InputMaybe<SortEnumType>;
  createdAt?: InputMaybe<SortEnumType>;
  id?: InputMaybe<SortEnumType>;
  name?: InputMaybe<SortEnumType>;
};

export type GetGameQueryVariables = Exact<{
  gameId: Scalars['Long']['input'];
}>;


export type GetGameQuery = { __typename?: 'Query', game?: { __typename?: 'Game', id: any, name: string, entitiesGroups: Array<{ __typename?: 'EntityGroup', id: any, name: string, entities: Array<{ __typename?: 'Entity', id: any, name: string, x: number, y: number, rotation: number, showBack: boolean, width: number, height: number, order: number, image?: string | null, imageBack?: string | null, canFlip: boolean, canMove: boolean, canRotate: boolean, canBeDeleted: boolean, group: { __typename?: 'EntityGroup', id: any, name: string } }> }> } | null };

export type CreateRoomMutationVariables = Exact<{
  name: Scalars['String']['input'];
}>;


export type CreateRoomMutation = { __typename?: 'Mutation', createRoom?: { __typename?: 'Room', id: any, name: string } | null };

export type SendMessageMutationVariables = Exact<{
  roomId: Scalars['Long']['input'];
  message: Scalars['String']['input'];
}>;


export type SendMessageMutation = { __typename?: 'Mutation', sendChatMessage?: { __typename?: 'ChatMessage', id: any } | null };

export type GetMessagesQueryVariables = Exact<{
  roomId: Scalars['Long']['input'];
}>;


export type GetMessagesQuery = { __typename?: 'Query', room?: { __typename?: 'Room', id: any, chatMessages: Array<{ __typename?: 'ChatMessage', id: any, createdAt: any, name: string, user?: { __typename?: 'User', id: any, name: string, color: string } | null }> } | null };

export type GetGamePlayedQueryVariables = Exact<{
  gamePlayedId: Scalars['Long']['input'];
}>;


export type GetGamePlayedQuery = { __typename?: 'Query', gamePlayed?: { __typename?: 'GamePlayed', id: any, players: Array<{ __typename?: 'Player', id: any, user: { __typename?: 'User', id: any, name: string, color: string } }>, game: { __typename?: 'Game', id: any, name: string }, room: { __typename?: 'Room', id: any, name: string }, entitiesGroups?: Array<{ __typename?: 'EntityGroup', id: any, name: string, randomize: boolean, canRemoveNotUsed: boolean } | null> | null, entities?: Array<{ __typename?: 'EntityPlayed', id: any, image?: string | null, imageBack?: string | null, width: number, height: number, order: number, name?: string | null, canFlip: EntityFlippableState, canMove: boolean, canRotate: boolean, canBeDeleted: boolean, isMine: boolean, x: number, y: number, rotation: number, container?: string | null, showBack: boolean, deleted: boolean, onlyForOwner: boolean, linkToId?: any | null, owner?: { __typename?: 'Player', id: any, user: { __typename?: 'User', id: any, name: string, color: string } } | null } | null> | null } | null };

export type GameActionSubscriptionVariables = Exact<{ [key: string]: never; }>;


export type GameActionSubscription = { __typename?: 'Subscription', gameAction?: { __typename?: 'EntityPlayed', id: any, name?: string | null, canFlip: EntityFlippableState, canMove: boolean, canRotate: boolean, canBeDeleted: boolean, isMine: boolean, x: number, y: number, rotation: number, container?: string | null, showBack: boolean, deleted: boolean, order: number, onlyForOwner: boolean, owner?: { __typename?: 'Player', id: any, user: { __typename?: 'User', id: any, name: string, color: string } } | null, entitiesLinked: Array<{ __typename?: 'EntityPlayed', id: any, canFlip: EntityFlippableState, canMove: boolean, canRotate: boolean, canBeDeleted: boolean, isMine: boolean, x: number, y: number, rotation: number, container?: string | null, showBack: boolean, deleted: boolean, owner?: { __typename?: 'Player', id: any, user: { __typename?: 'User', id: any } } | null }> } | null };

export type MoveEntityMutationVariables = Exact<{
  entityPlayedId: Scalars['Long']['input'];
  x: Scalars['Int']['input'];
  y: Scalars['Int']['input'];
  container?: InputMaybe<Scalars['String']['input']>;
}>;


export type MoveEntityMutation = { __typename?: 'Mutation', gameMoveEntity: { __typename?: 'EntityPlayed', id: any, container?: string | null, x: number, y: number, isMine: boolean, owner?: { __typename?: 'Player', id: any, user: { __typename?: 'User', id: any } } | null, entitiesLinked: Array<{ __typename?: 'EntityPlayed', id: any, x: number, y: number, container?: string | null }> } };

export type FlipEntityMutationVariables = Exact<{
  entityPlayedId: Scalars['Long']['input'];
  showBack: Scalars['Boolean']['input'];
  onlyForOwner?: InputMaybe<Scalars['Boolean']['input']>;
}>;


export type FlipEntityMutation = { __typename?: 'Mutation', gameFlipEntity: { __typename?: 'EntityPlayed', id: any, name?: string | null, showBack: boolean, canFlip: EntityFlippableState, onlyForOwner: boolean, container?: string | null, isMine: boolean, owner?: { __typename?: 'Player', id: any, user: { __typename?: 'User', id: any } } | null } };

export type RotateEntityMutationVariables = Exact<{
  entityPlayedId: Scalars['Long']['input'];
  rotation: Scalars['Int']['input'];
}>;


export type RotateEntityMutation = { __typename?: 'Mutation', gameRotateEntity: { __typename?: 'EntityPlayed', id: any, rotation: number, isMine: boolean, owner?: { __typename?: 'Player', id: any, user: { __typename?: 'User', id: any } } | null } };

export type DeleteEntityMutationVariables = Exact<{
  entityPlayedId: Scalars['Long']['input'];
}>;


export type DeleteEntityMutation = { __typename?: 'Mutation', gameDeleteEntity: { __typename?: 'EntityPlayed', id: any, deleted: boolean, isMine: boolean, owner?: { __typename?: 'Player', id: any, user: { __typename?: 'User', id: any } } | null, entitiesLinked: Array<{ __typename?: 'EntityPlayed', id: any, deleted: boolean }> } };

export type GiveEntityMutationVariables = Exact<{
  entityPlayedId: Scalars['Long']['input'];
  newPlayerId: Scalars['Long']['input'];
  container?: InputMaybe<Scalars['String']['input']>;
}>;


export type GiveEntityMutation = { __typename?: 'Mutation', gameGiveEntity: { __typename?: 'EntityPlayed', id: any, isMine: boolean, owner?: { __typename?: 'Player', id: any, user: { __typename?: 'User', id: any } } | null } };

export type DeleteNotTouchedInGroupMutationVariables = Exact<{
  gamePlayedId: Scalars['Long']['input'];
  entityGroupId: Scalars['Long']['input'];
}>;


export type DeleteNotTouchedInGroupMutation = { __typename?: 'Mutation', deleteEntitiesNotTouched: Array<{ __typename?: 'EntityPlayed', id: any, deleted: boolean }> };

export type RandomizeEntitiesMutationVariables = Exact<{
  gamePlayedId: Scalars['Long']['input'];
  entityGroupId: Scalars['Long']['input'];
  onlyTouched: Scalars['Boolean']['input'];
  restoreDeleted: Scalars['Boolean']['input'];
}>;


export type RandomizeEntitiesMutation = { __typename?: 'Mutation', randomizeEntities: Array<{ __typename?: 'EntityPlayed', id: any, x: number, y: number, container?: string | null, order: number, rotation: number, showBack: boolean, canFlip: EntityFlippableState, onlyForOwner: boolean, deleted: boolean, owner?: { __typename?: 'Player', id: any, user: { __typename?: 'User', id: any } } | null, entitiesLinked: Array<{ __typename?: 'EntityPlayed', id: any, x: number, y: number, container?: string | null, order: number, rotation: number, showBack: boolean, canFlip: EntityFlippableState, onlyForOwner: boolean, deleted: boolean, owner?: { __typename?: 'Player', id: any, user: { __typename?: 'User', id: any } } | null }> }> };

export type SetCurrentGameMutationVariables = Exact<{
  gamePlayedId: Scalars['Long']['input'];
}>;


export type SetCurrentGameMutation = { __typename?: 'Mutation', setCurrentGame?: { __typename?: 'Room', id: any, currentGame?: { __typename?: 'GamePlayed', id: any, game: { __typename?: 'Game', id: any, name: string, image?: string | null } } | null } | null };

export type GetRoomQueryVariables = Exact<{
  roomId: Scalars['Long']['input'];
}>;


export type GetRoomQuery = { __typename?: 'Query', room?: { __typename?: 'Room', id: any, name: string, users: Array<{ __typename?: 'User', id: any, name: string, color: string }>, games: Array<{ __typename?: 'GamePlayed', id: any, createdAt: any, isFinished: boolean, game: { __typename?: 'Game', id: any } }>, currentGame?: { __typename?: 'GamePlayed', id: any, createdAt: any, isFinished: boolean, game: { __typename?: 'Game', id: any, name: string, image?: string | null } } | null } | null };

export type GetGamesQueryVariables = Exact<{ [key: string]: never; }>;


export type GetGamesQuery = { __typename?: 'Query', games: Array<{ __typename?: 'Game', id: any, name: string, image?: string | null }> };

export type UpdateRoomSubscriptionVariables = Exact<{ [key: string]: never; }>;


export type UpdateRoomSubscription = { __typename?: 'Subscription', roomAction?: { __typename?: 'Room', id: any } | null };

export type InitGameMutationVariables = Exact<{
  roomId: Scalars['Long']['input'];
  gameId: Scalars['Long']['input'];
}>;


export type InitGameMutation = { __typename?: 'Mutation', initializeGame?: { __typename?: 'GamePlayed', id: any } | null };

export type LeaveRoomMutationVariables = Exact<{
  roomId: Scalars['Long']['input'];
  userId: Scalars['Long']['input'];
}>;


export type LeaveRoomMutation = { __typename?: 'Mutation', leaveRoom?: { __typename?: 'Room', id: any } | null };

export type GetRoomsQueryVariables = Exact<{ [key: string]: never; }>;


export type GetRoomsQuery = { __typename?: 'Query', rooms: Array<{ __typename?: 'Room', id: any, name: string, createdAt: any, userConnectedIsInside: boolean, owner: { __typename?: 'User', id: any, name: string, color: string } }> };

export type NewRoomSubscriptionVariables = Exact<{ [key: string]: never; }>;


export type NewRoomSubscription = { __typename?: 'Subscription', newRoom?: { __typename?: 'Room', id: any } | null };

export type JoinRoomMutationVariables = Exact<{
  roomId: Scalars['Long']['input'];
}>;


export type JoinRoomMutation = { __typename?: 'Mutation', joinRoom?: { __typename?: 'Room', id: any } | null };

export type UpdateEntityMutationVariables = Exact<{
  entityId: Scalars['Long']['input'];
  dto: EntityUpdateDtoInput;
}>;


export type UpdateEntityMutation = { __typename?: 'Mutation', updateEntity: Array<{ __typename?: 'Entity', id: any, name: string, x: number, y: number, rotation: number, showBack: boolean }> };

export type LoginMutationVariables = Exact<{
  name: Scalars['String']['input'];
  color: Scalars['String']['input'];
}>;


export type LoginMutation = { __typename?: 'Mutation', login?: { __typename?: 'User', id: any, name: string, color: string, token?: string | null } | null };

export type MeQueryVariables = Exact<{ [key: string]: never; }>;


export type MeQuery = { __typename?: 'Query', me?: { __typename?: 'User', id: any, name: string, color: string } | null };

export const GetGameDocument = gql`
    query getGame($gameId: Long!) {
  game(gameId: $gameId) {
    id
    name
    entitiesGroups {
      id
      name
      entities {
        id
        name
        x
        y
        rotation
        showBack
        width
        height
        order
        image
        imageBack
        canFlip
        canMove
        canRotate
        canBeDeleted
        group {
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
  export class GetGameGQL extends Apollo.Query<GetGameQuery, GetGameQueryVariables> {
    override document = GetGameDocument;
    
    constructor(apollo: Apollo.Apollo) {
      super(apollo);
    }
  }
export const CreateRoomDocument = gql`
    mutation createRoom($name: String!) {
  createRoom(name: $name) {
    id
    name
  }
}
    `;

  @Injectable({
    providedIn: 'root'
  })
  export class CreateRoomGQL extends Apollo.Mutation<CreateRoomMutation, CreateRoomMutationVariables> {
    override document = CreateRoomDocument;
    
    constructor(apollo: Apollo.Apollo) {
      super(apollo);
    }
  }
export const SendMessageDocument = gql`
    mutation sendMessage($roomId: Long!, $message: String!) {
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
    query getMessages($roomId: Long!) {
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
export const GetGamePlayedDocument = gql`
    query getGamePlayed($gamePlayedId: Long!) {
  gamePlayed(gamePlayedId: $gamePlayedId) {
    id
    players {
      id
      user {
        id
        name
        color
      }
    }
    game {
      id
      name
    }
    room {
      id
      name
    }
    entitiesGroups {
      id
      name
      randomize
      canRemoveNotUsed
    }
    entities {
      id
      image
      imageBack
      width
      height
      order
      name
      canFlip
      canMove
      canRotate
      canBeDeleted
      isMine
      x
      y
      rotation
      container
      showBack
      deleted
      onlyForOwner
      owner {
        id
        user {
          id
          name
          color
        }
      }
      linkToId
    }
  }
}
    `;

  @Injectable({
    providedIn: 'root'
  })
  export class GetGamePlayedGQL extends Apollo.Query<GetGamePlayedQuery, GetGamePlayedQueryVariables> {
    override document = GetGamePlayedDocument;
    
    constructor(apollo: Apollo.Apollo) {
      super(apollo);
    }
  }
export const GameActionDocument = gql`
    subscription gameAction {
  gameAction {
    id
    name
    canFlip
    canMove
    canRotate
    canBeDeleted
    isMine
    x
    y
    rotation
    container
    showBack
    deleted
    order
    onlyForOwner
    owner {
      id
      user {
        id
        name
        color
      }
    }
    entitiesLinked {
      id
      canFlip
      canMove
      canRotate
      canBeDeleted
      isMine
      x
      y
      rotation
      container
      showBack
      deleted
      owner {
        id
        user {
          id
        }
      }
    }
  }
}
    `;

  @Injectable({
    providedIn: 'root'
  })
  export class GameActionGQL extends Apollo.Subscription<GameActionSubscription, GameActionSubscriptionVariables> {
    override document = GameActionDocument;
    
    constructor(apollo: Apollo.Apollo) {
      super(apollo);
    }
  }
export const MoveEntityDocument = gql`
    mutation moveEntity($entityPlayedId: Long!, $x: Int!, $y: Int!, $container: String) {
  gameMoveEntity(
    entityPlayedId: $entityPlayedId
    x: $x
    y: $y
    container: $container
  ) {
    id
    container
    x
    y
    isMine
    owner {
      id
      user {
        id
      }
    }
    entitiesLinked {
      id
      x
      y
      container
    }
  }
}
    `;

  @Injectable({
    providedIn: 'root'
  })
  export class MoveEntityGQL extends Apollo.Mutation<MoveEntityMutation, MoveEntityMutationVariables> {
    override document = MoveEntityDocument;
    
    constructor(apollo: Apollo.Apollo) {
      super(apollo);
    }
  }
export const FlipEntityDocument = gql`
    mutation flipEntity($entityPlayedId: Long!, $showBack: Boolean!, $onlyForOwner: Boolean) {
  gameFlipEntity(
    entityPlayedId: $entityPlayedId
    showBack: $showBack
    onlyForOwner: $onlyForOwner
  ) {
    id
    name
    showBack
    canFlip
    onlyForOwner
    container
    isMine
    owner {
      id
      user {
        id
      }
    }
  }
}
    `;

  @Injectable({
    providedIn: 'root'
  })
  export class FlipEntityGQL extends Apollo.Mutation<FlipEntityMutation, FlipEntityMutationVariables> {
    override document = FlipEntityDocument;
    
    constructor(apollo: Apollo.Apollo) {
      super(apollo);
    }
  }
export const RotateEntityDocument = gql`
    mutation rotateEntity($entityPlayedId: Long!, $rotation: Int!) {
  gameRotateEntity(entityPlayedId: $entityPlayedId, rotation: $rotation) {
    id
    rotation
    isMine
    owner {
      id
      user {
        id
      }
    }
  }
}
    `;

  @Injectable({
    providedIn: 'root'
  })
  export class RotateEntityGQL extends Apollo.Mutation<RotateEntityMutation, RotateEntityMutationVariables> {
    override document = RotateEntityDocument;
    
    constructor(apollo: Apollo.Apollo) {
      super(apollo);
    }
  }
export const DeleteEntityDocument = gql`
    mutation deleteEntity($entityPlayedId: Long!) {
  gameDeleteEntity(entityPlayedId: $entityPlayedId) {
    id
    deleted
    isMine
    owner {
      id
      user {
        id
      }
    }
    entitiesLinked {
      id
      deleted
    }
  }
}
    `;

  @Injectable({
    providedIn: 'root'
  })
  export class DeleteEntityGQL extends Apollo.Mutation<DeleteEntityMutation, DeleteEntityMutationVariables> {
    override document = DeleteEntityDocument;
    
    constructor(apollo: Apollo.Apollo) {
      super(apollo);
    }
  }
export const GiveEntityDocument = gql`
    mutation giveEntity($entityPlayedId: Long!, $newPlayerId: Long!, $container: String) {
  gameGiveEntity(
    entityPlayedId: $entityPlayedId
    newPlayerId: $newPlayerId
    container: $container
  ) {
    id
    isMine
    owner {
      id
      user {
        id
      }
    }
  }
}
    `;

  @Injectable({
    providedIn: 'root'
  })
  export class GiveEntityGQL extends Apollo.Mutation<GiveEntityMutation, GiveEntityMutationVariables> {
    override document = GiveEntityDocument;
    
    constructor(apollo: Apollo.Apollo) {
      super(apollo);
    }
  }
export const DeleteNotTouchedInGroupDocument = gql`
    mutation deleteNotTouchedInGroup($gamePlayedId: Long!, $entityGroupId: Long!) {
  deleteEntitiesNotTouched(
    gamePlayedId: $gamePlayedId
    entityGroupId: $entityGroupId
  ) {
    id
    deleted
  }
}
    `;

  @Injectable({
    providedIn: 'root'
  })
  export class DeleteNotTouchedInGroupGQL extends Apollo.Mutation<DeleteNotTouchedInGroupMutation, DeleteNotTouchedInGroupMutationVariables> {
    override document = DeleteNotTouchedInGroupDocument;
    
    constructor(apollo: Apollo.Apollo) {
      super(apollo);
    }
  }
export const RandomizeEntitiesDocument = gql`
    mutation randomizeEntities($gamePlayedId: Long!, $entityGroupId: Long!, $onlyTouched: Boolean!, $restoreDeleted: Boolean!) {
  randomizeEntities(
    gamePlayedId: $gamePlayedId
    entityGroupId: $entityGroupId
    onlyTouched: $onlyTouched
    restoreDeleted: $restoreDeleted
  ) {
    id
    x
    y
    container
    order
    rotation
    showBack
    canFlip
    onlyForOwner
    deleted
    owner {
      id
      user {
        id
      }
    }
    entitiesLinked {
      id
      x
      y
      container
      order
      rotation
      showBack
      canFlip
      onlyForOwner
      deleted
      owner {
        id
        user {
          id
        }
      }
    }
  }
}
    `;

  @Injectable({
    providedIn: 'root'
  })
  export class RandomizeEntitiesGQL extends Apollo.Mutation<RandomizeEntitiesMutation, RandomizeEntitiesMutationVariables> {
    override document = RandomizeEntitiesDocument;
    
    constructor(apollo: Apollo.Apollo) {
      super(apollo);
    }
  }
export const SetCurrentGameDocument = gql`
    mutation setCurrentGame($gamePlayedId: Long!) {
  setCurrentGame(gamePlayedId: $gamePlayedId) {
    id
    currentGame {
      id
      game {
        id
        name
        image
      }
    }
  }
}
    `;

  @Injectable({
    providedIn: 'root'
  })
  export class SetCurrentGameGQL extends Apollo.Mutation<SetCurrentGameMutation, SetCurrentGameMutationVariables> {
    override document = SetCurrentGameDocument;
    
    constructor(apollo: Apollo.Apollo) {
      super(apollo);
    }
  }
export const GetRoomDocument = gql`
    query getRoom($roomId: Long!) {
  room(roomId: $roomId) {
    id
    name
    users(order: {name: ASC}) {
      id
      name
      color
    }
    games(order: {createdAt: DESC, game: {name: ASC}}) {
      id
      createdAt
      isFinished
      game {
        id
      }
    }
    currentGame {
      id
      createdAt
      isFinished
      game {
        id
        name
        image
      }
    }
  }
}
    `;

  @Injectable({
    providedIn: 'root'
  })
  export class GetRoomGQL extends Apollo.Query<GetRoomQuery, GetRoomQueryVariables> {
    override document = GetRoomDocument;
    
    constructor(apollo: Apollo.Apollo) {
      super(apollo);
    }
  }
export const GetGamesDocument = gql`
    query getGames {
  games(order: {name: ASC}) {
    id
    name
    image
  }
}
    `;

  @Injectable({
    providedIn: 'root'
  })
  export class GetGamesGQL extends Apollo.Query<GetGamesQuery, GetGamesQueryVariables> {
    override document = GetGamesDocument;
    
    constructor(apollo: Apollo.Apollo) {
      super(apollo);
    }
  }
export const UpdateRoomDocument = gql`
    subscription updateRoom {
  roomAction {
    id
  }
}
    `;

  @Injectable({
    providedIn: 'root'
  })
  export class UpdateRoomGQL extends Apollo.Subscription<UpdateRoomSubscription, UpdateRoomSubscriptionVariables> {
    override document = UpdateRoomDocument;
    
    constructor(apollo: Apollo.Apollo) {
      super(apollo);
    }
  }
export const InitGameDocument = gql`
    mutation initGame($roomId: Long!, $gameId: Long!) {
  initializeGame(roomId: $roomId, gameId: $gameId) {
    id
  }
}
    `;

  @Injectable({
    providedIn: 'root'
  })
  export class InitGameGQL extends Apollo.Mutation<InitGameMutation, InitGameMutationVariables> {
    override document = InitGameDocument;
    
    constructor(apollo: Apollo.Apollo) {
      super(apollo);
    }
  }
export const LeaveRoomDocument = gql`
    mutation leaveRoom($roomId: Long!, $userId: Long!) {
  leaveRoom(roomId: $roomId, userId: $userId) {
    id
  }
}
    `;

  @Injectable({
    providedIn: 'root'
  })
  export class LeaveRoomGQL extends Apollo.Mutation<LeaveRoomMutation, LeaveRoomMutationVariables> {
    override document = LeaveRoomDocument;
    
    constructor(apollo: Apollo.Apollo) {
      super(apollo);
    }
  }
export const GetRoomsDocument = gql`
    query getRooms {
  rooms {
    id
    name
    createdAt
    userConnectedIsInside
    owner {
      id
      name
      color
    }
  }
}
    `;

  @Injectable({
    providedIn: 'root'
  })
  export class GetRoomsGQL extends Apollo.Query<GetRoomsQuery, GetRoomsQueryVariables> {
    override document = GetRoomsDocument;
    
    constructor(apollo: Apollo.Apollo) {
      super(apollo);
    }
  }
export const NewRoomDocument = gql`
    subscription newRoom {
  newRoom {
    id
  }
}
    `;

  @Injectable({
    providedIn: 'root'
  })
  export class NewRoomGQL extends Apollo.Subscription<NewRoomSubscription, NewRoomSubscriptionVariables> {
    override document = NewRoomDocument;
    
    constructor(apollo: Apollo.Apollo) {
      super(apollo);
    }
  }
export const JoinRoomDocument = gql`
    mutation joinRoom($roomId: Long!) {
  joinRoom(roomId: $roomId) {
    id
  }
}
    `;

  @Injectable({
    providedIn: 'root'
  })
  export class JoinRoomGQL extends Apollo.Mutation<JoinRoomMutation, JoinRoomMutationVariables> {
    override document = JoinRoomDocument;
    
    constructor(apollo: Apollo.Apollo) {
      super(apollo);
    }
  }
export const UpdateEntityDocument = gql`
    mutation updateEntity($entityId: Long!, $dto: EntityUpdateDtoInput!) {
  updateEntity(entityId: $entityId, dto: $dto) {
    id
    name
    x
    y
    rotation
    showBack
  }
}
    `;

  @Injectable({
    providedIn: 'root'
  })
  export class UpdateEntityGQL extends Apollo.Mutation<UpdateEntityMutation, UpdateEntityMutationVariables> {
    override document = UpdateEntityDocument;
    
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