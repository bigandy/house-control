import {
  Session as _Session,
  useSession as _useSession,
  getSession as _getSession,
} from "next-auth/react";
import { User as _User } from "next-auth";
//   import { User } from "utils/database/context";

export interface User {
  name: string;
  email: string;
  picture: string;
  sub: string;
  id: string;
  accessToken: string;
  iat: number;
  exp: number;
}

/**
 * A boosted version of {@link _Session} that contains fields
 * extracted from {@link User}, notably
 * {@link User.userId} and {@link User.completedOnboards}
 *
 * This should be used in place of the regular next-auth session type.
 */
export type Session = _Session & {
  user: _User & User;
};

/**
 * Boost the useSession hook to cast to a modified session type containing
 * injected userId information
 */
export function useSession(): [Session, boolean] {
  //@ts-ignore
  const [session, loading]: [Session, boolean] = _useSession();
  return [session, loading];
}

/**
 * boost the getSession function to include the injected userId type
 */
export function getSession(
  context?: Parameters<typeof _getSession>[0]
): Promise<Session> {
  if ((context as any).req.session) {
    return Promise.resolve((context as any).req.session);
  }
  return _getSession(context) as Promise<Session>;
}
