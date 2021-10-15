import { gql } from '@apollo/client';
import * as Apollo from '@apollo/client';
export type Maybe<T> = T | null;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
const defaultOptions =  {}
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: string;
  String: string;
  Boolean: boolean;
  Int: number;
  Float: number;
  /** The javascript `Date` as string. Type represents date and time as the ISO Date string. */
  DateTime: any;
};

export type CreatePostInput = {
  text: Scalars['String'];
  title: Scalars['String'];
};

export type FieldError = {
  __typename?: 'FieldError';
  field: Scalars['String'];
  message: Scalars['String'];
};

export type IMutationResponse = {
  code: Scalars['Float'];
  message?: Maybe<Scalars['String']>;
  success: Scalars['Boolean'];
};

export type LoginInput = {
  password: Scalars['String'];
  usernameOrEmail: Scalars['String'];
};

export type Mutation = {
  __typename?: 'Mutation';
  createPost: PostMutationResponse;
  deletePost: PostMutationResponse;
  login: UserMutationReponse;
  logout: Scalars['Boolean'];
  register: UserMutationReponse;
  updatePost: PostMutationResponse;
};


export type MutationCreatePostArgs = {
  createPostInput: CreatePostInput;
};


export type MutationDeletePostArgs = {
  id: Scalars['ID'];
};


export type MutationLoginArgs = {
  loginInput: LoginInput;
};


export type MutationRegisterArgs = {
  registerInput: RegisterInput;
};


export type MutationUpdatePostArgs = {
  updatePostInput: UpdatePostInput;
};

export type Post = {
  __typename?: 'Post';
  createdAt: Scalars['DateTime'];
  id: Scalars['ID'];
  text: Scalars['String'];
  title: Scalars['String'];
  updatedAt: Scalars['DateTime'];
};

export type PostMutationResponse = IMutationResponse & {
  __typename?: 'PostMutationResponse';
  code: Scalars['Float'];
  errors?: Maybe<Array<FieldError>>;
  message?: Maybe<Scalars['String']>;
  post?: Maybe<Post>;
  success: Scalars['Boolean'];
};

export type Query = {
  __typename?: 'Query';
  hello: Scalars['String'];
  post?: Maybe<Post>;
  posts?: Maybe<Array<Post>>;
};


export type QueryPostArgs = {
  id: Scalars['ID'];
};

export type RegisterInput = {
  email: Scalars['String'];
  password: Scalars['String'];
  username: Scalars['String'];
};

export type UpdatePostInput = {
  id: Scalars['ID'];
  text: Scalars['String'];
  title: Scalars['String'];
};

export type User = {
  __typename?: 'User';
  createdAt: Scalars['DateTime'];
  email: Scalars['String'];
  id: Scalars['ID'];
  updatedAt: Scalars['DateTime'];
  username: Scalars['String'];
};

export type UserMutationReponse = IMutationResponse & {
  __typename?: 'UserMutationReponse';
  code: Scalars['Float'];
  errors?: Maybe<Array<FieldError>>;
  message?: Maybe<Scalars['String']>;
  success: Scalars['Boolean'];
  user?: Maybe<User>;
};

export type RegisrerMutationVariables = Exact<{
  registerInput: RegisterInput;
}>;


export type RegisrerMutation = { __typename?: 'Mutation', register: { __typename?: 'UserMutationReponse', code: number, success: boolean, message?: string | null | undefined, user?: { __typename?: 'User', id: string, username: string, email: string } | null | undefined, errors?: Array<{ __typename?: 'FieldError', field: string, message: string }> | null | undefined } };


export const RegisrerDocument = gql`
    mutation Regisrer($registerInput: RegisterInput!) {
  register(registerInput: $registerInput) {
    code
    success
    message
    user {
      id
      username
      email
    }
    errors {
      field
      message
    }
  }
}
    `;
export type RegisrerMutationFn = Apollo.MutationFunction<RegisrerMutation, RegisrerMutationVariables>;

/**
 * __useRegisrerMutation__
 *
 * To run a mutation, you first call `useRegisrerMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useRegisrerMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [regisrerMutation, { data, loading, error }] = useRegisrerMutation({
 *   variables: {
 *      registerInput: // value for 'registerInput'
 *   },
 * });
 */
export function useRegisrerMutation(baseOptions?: Apollo.MutationHookOptions<RegisrerMutation, RegisrerMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<RegisrerMutation, RegisrerMutationVariables>(RegisrerDocument, options);
      }
export type RegisrerMutationHookResult = ReturnType<typeof useRegisrerMutation>;
export type RegisrerMutationResult = Apollo.MutationResult<RegisrerMutation>;
export type RegisrerMutationOptions = Apollo.BaseMutationOptions<RegisrerMutation, RegisrerMutationVariables>;