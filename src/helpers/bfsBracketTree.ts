import type { Bracket } from '~/types';

export function bfsBracketTree(brackets: Bracket, value: any, key: 'id' | 'match' | 'player_id' | 'tournament_id' = 'id') {
  let a: Array<Bracket> = [brackets];
  let b: Array<Bracket> = [];

  while (a.length > 0) {
    const bracket = a[0];
    if (bracket[key] === value)
      return bracket;

    if (bracket) {
      if (bracket.prev_match) {
        if (bracket.prev_match.left)
          b.push(bracket.prev_match.left);

        if (bracket.prev_match.right)
          b.push(bracket.prev_match.right);
      }
    }

    a.shift();
    if (a.length === 0 && b.length > 0) {
      a = [...b];
      b = [];
    }
  }
  return null;
}
