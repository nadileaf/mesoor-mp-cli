import { defineStore } from 'pinia';
import { useAuthStore } from './index';
import { uniq } from 'lodash-es';

export type SearchHistoryOption = { value: string; label?: string };

interface State {
  histories: SearchHistoryOption[];
}

export const useSearchStore = defineStore('search', {
  state: (): State => {
    const { clientOpenId } = useAuthStore();
    const key = `search-history_${clientOpenId || 'default'}`;
    return {
      get histories() {
        return uni.getStorageSync(key) || [];
      },
      set histories(value: SearchHistoryOption[]) {
        uni.setStorageSync(key, value.slice(0, 10));
      }
    };
  },
  actions: {
    addHistoryOption(option: SearchHistoryOption) {
      this.setHistoryOption(option, 'add');
    },
    removeHistoryOption(option: SearchHistoryOption) {
      this.setHistoryOption(option, 'remove');
    },
    setHistoryOption(option: SearchHistoryOption, action: 'add' | 'remove') {
      console.log(option);
      const histories = this.histories;
      const index = histories.findIndex((item) => item.value === option.value);
      index >= 0 && histories.splice(index, 1);
      action === 'add' && histories.unshift(option);
      this.histories = uniq(histories);
    },
    clearHistories() {
      this.histories = [];
    }
  }
});
