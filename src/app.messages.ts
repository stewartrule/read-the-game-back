import { Game } from './game/game.entity';
import { Intercept } from './intercept/intercept.entity';
import { Shot } from './shot/shot.entity';

export enum Topic {
  Game = 'Game',
}

export type ShotAddedMessage = {
  shot: Shot;
  game: Game;
  type: 'shot';
};

export type InterceptAddedMessage = {
  intercept: Intercept;
  game: Game;
  type: 'intercept';
};

export const filterByType = (type: Message['type']) => ({
  payload,
}: {
  payload: Message;
}) => payload.type === type;

export type Message = ShotAddedMessage | InterceptAddedMessage;
