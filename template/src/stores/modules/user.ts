import { defineStore } from 'pinia';
import { userService } from '@/services/user';
import { entityService } from '@/services/entity';
import { useAuthStore } from '.';
// import localStore from '@/utils/localStore';

interface State {
  users: UserModel.User[];
  /** 记录用户选择点击次数，方便排序 */
  selectUserCount: Record<string, number>;
  selfTenantMemberDetail?: EntityModel.BusinessEntity;
}

export const useUserStore = defineStore('user', {
  state: (): State => {
    const authStore = useAuthStore();
    const key = `user_${authStore.user?.userId || 'default'}_select_count`;
    return {
      users: [],

      get selectUserCount() {
        return uni.getStorageSync(key);
      },
      set selectUserCount(val) {
        uni.setStorageSync(key, val);
      }
    };
  },
  getters: {
    sortedUsers(state) {
      return state.users
        .sort((a, b) => getSelectUserCount(state, b.userId) - getSelectUserCount(state, a.userId))
        .filter((user) => user.active);
    },
    userMaps(state) {
      return new Map(state.users.map((item) => [item.userId, item]));
    },
    tenantMemberIdPrefix: () => {
      const authStore = useAuthStore();
      return `${authStore.tenant}T`;
    },
    selfTenantMemberId() {
      const authStore = useAuthStore();
      return (authStore.user?.userId && this.tenantMemberIdPrefix + authStore.user?.userId) || '';
    },
    getUserById() {
      return (id?: string) => {
        if (!id) return;
        //如果是tenantMemberId，则转换成userId
        const _id = id.replace(this.tenantMemberIdPrefix, '');
        return this.userMaps.get(_id);
      };
    },
    getUsersByIds() {
      return (ids: string[]) =>
        ids.reduce((prev: UserModel.User[], id) => {
          const result = this.getUserById(id);
          result && prev.push(result);
          return prev;
        }, []);
    },
    getUserExcludeIds() {
      const sortedUsers = this.sortedUsers;
      return (ids: string[], name?: string) =>
        sortedUsers.filter((user) => {
          if (name) return !ids.includes(user.userId) && user.username.includes(name);
          return !ids.includes(user.userId);
        });
    },
    getUserIncludeIds() {
      const sortedUsers = this.sortedUsers;
      return (ids: string[], name?: string) =>
        sortedUsers.filter((user) => {
          if (name) return ids.includes(user.userId) && user.username.includes(name);
          return ids.includes(user.userId);
        });
    },
    filterByName() {
      const sortedUsers = this.sortedUsers;
      return (name?: string) => (name ? sortedUsers.filter((user) => user.username.includes(name)) : sortedUsers);
    }
  },
  actions: {
    transformTenantMemberId(id?: string) {
      if (!id?.startsWith(this.tenantMemberIdPrefix)) return this.tenantMemberIdPrefix + id;
      return id;
    },
    // 获取员工列表
    async getUsers(refresh?: boolean) {
      if (!this.users.length || refresh) {
        this.users = await userService.query();
      }
    },
    setSelectUserCount(userId: string) {
      this.selectUserCount = {
        ...this.selectUserCount,
        [userId]: (this.selectUserCount[userId] || 0) + 1
      };
    }
  }
});

function getSelectUserCount(state: State, id: string) {
  const authStore = useAuthStore();
  return id === authStore.user?.userId ? Infinity : state.selectUserCount[id] || 0;
}
