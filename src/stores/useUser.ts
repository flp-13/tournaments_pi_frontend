import axios from 'axios';
import { defineStore } from 'pinia';
import type { User } from '~/types';

export const useUser = defineStore('user', {
  state(): User {
    return {
      id: 0,
      name: '',
    }
  },
  actions: {
    getUser(cb?: () => void) {
      axios.get<{
        id: string
        name: string
      }>('me')
        .then((res) => {
          Object.assign(this, res.data);
          if (cb)
            cb();
        })
        .catch(() => {
          if (cb)
            cb();
        });
    },
  },
});
