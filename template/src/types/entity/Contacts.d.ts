declare namespace ContactsModel {
  type StandardFields = {
    emails?: string[];
    /**
     * 收件人
     */
    recipient?: string;
    /**
     * 公司名
     */
    companyName?: string;
    /**
     * 描述
     */
    description?: string;
    /**
     * 收件人手机号
     */
    phoneNumber?: string;
    /**
     * 模板类型
     */
    templateType?: string;
    /**
     * 签署日期
     */
    dateOfSignature?: string;
    /**
     * 收件地址
     */
    incomingAddress?: string;
    /**
     * 公司名规范化
     */
    companyNormalized?: string;
  };

  type Contacts = SchemaEntity.SchemaEntity<StandardFields>;
}
