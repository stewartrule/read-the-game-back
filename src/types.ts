export interface PlayerAction {
  x: number;
  y: number;
  fromPlayerId: number;
  fromTeamId: number;
  happenedAt: Date;
}
