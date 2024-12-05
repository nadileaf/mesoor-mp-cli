import request from '@/utils/request';
import { effexConfigsPrefixUrl } from '.';

export type KellyCriterionParams = {
  // 工资收入权重
  b_salary_weight: number;
  // 工资收入分数(-1 ~ 1)
  b_salary_score: number;
  // 职业发展权重
  b_career_weight: number;
  // 职业发展分数(-1 ~ 1)
  b_career_score: number;
  // 工作生活平衡权重
  b_wl_balance_weight: number;
  // 工作生活平衡分数(-1 ~ 1)
  b_wl_balance_score: number;
  // 价值观契合度权重(面子受尊重)
  b_life_persp_weight: number;
  // 价值观契合度分数(-1 ~ 1)
  b_life_persp_score: number;

  // 公司稳定的重要性权重
  p_stablecomp_weight: number;
  // 公司稳定的分数(-1 ~ 1)
  p_stablecomp_score: number;
  // 技能契合的重要性权重
  p_skill_weight: number;
  // 技能契合的分数(-1 ~ 1)
  p_skill_score: number;
  // 行业契合重要性权重
  p_industry_weight: number;
  // 行业契合分数(-1 ~ 1)
  p_industry_score: number;
  // 企业文化契合重要性权重
  p_culture_weight: number;
  // 企业文化契合分数(-1 ~ 1)
  p_culture_score: number;
};

export const difyService = {
  async getKellyCriterionScore(kellyCriterionParams: KellyCriterionParams) {
    console.log('kellyCriterionParams', kellyCriterionParams);
    const res = await request.post<{ score: number }>(
      effexConfigsPrefixUrl(`/v1/configs/invoke`),
      {
        config_id: 'shanghaidezhuqiyeguanli-188-dify-shenzhou-lie-kelly-decision-formula-public',
        data: kellyCriterionParams,
        input_json_as_string: false,
        output_json_as_string: false
      },
      {
        handleResponseData: false
      }
    );
    return res;
  }
};
