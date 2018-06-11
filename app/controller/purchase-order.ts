import BaseController from '../core/base-controller';

export default class PurchaseOrderController extends BaseController {

  async index() {
    const { service, ctx } = this;

    try {
      const result: object = await service.purchaseOrder.findCondition(ctx.query);
      // list.forEach(item => item.createdAt = moment(item.createdAt).format('YYYY-MM-DD HH:mm:ss'))
      this.success(result);
    } catch (error) {
      this.fail(error);
    }
  }

  async add() {
    const { service, ctx } = this;
    const { categoryID, supplierID, goods, transactor, remark } = ctx.request.body;
    // 采购单编号生成规则：CG(`采购`首字母) + 20180415150610(YYYYMMDDHHmmss) + E0STI4(6位随机UUID)
    const id = 'CG' + ctx.helper.dateFormat(new Date(), 'YYYYMMDDHHmmss') + ctx.helper.uuid(6, 36);
    const rowData = {
      id,
      category: { id: categoryID },
      supplier: { id: supplierID },
      mainOrders: await this.__generatePurchaseMainOrder(goods),
      transactor,
      remark,
      status: 1
    };

    try {
      await service.purchaseOrder.insertPurchaseOrder(rowData);
      this.success();
    } catch (error) {
      this.fail(error);
    }
  }

  async delete() {
    const { service, ctx } = this;
    const rowData: any = ctx.request.body;

    try {
      await service.purchaseOrder.deletePurchaseOrder(rowData);
      this.success();
    } catch (error) {
      this.fail(error);
    }
  }

  //- 该方法暂时没用到
  async update() {
    const { service, ctx } = this;
    const rowData: any = ctx.request.body;

    try {
      await service.purchaseOrder.updatePurchaseOrder(rowData);
      this.success();
    } catch (error) {
      this.fail(error);
    }
  }

  async details() {
    const { service, ctx } = this;

    try {
      const result: object = await service.purchaseOrder.findOne(ctx.query.id);
      this.success(result);
    } catch (error) {
      this.fail(error);
    }
  }

  // 生成采购商品单主订单数据
  async __generatePurchaseMainOrder(_goods) {
      let mainOrders = [];
      for (const goods of _goods) {
        // 采购商品单编号生成规则： M(代表主订单) + 商品编号(0502020001) + E0STI4(6位随机UUID)
        const mid = `M${goods.goodsNo}${this.ctx.helper.uuid(6, 36)}`;
        mainOrders.push({
          mid,
          goods,
          childOrders: await this.__generatePurchaseChildOrder(goods),
          status: 1,
          purchaseNum: goods.purchaseNum
        });
      }
      mainOrders = await this.service.purchaseOrder.insertPurchaseMainOrder(mainOrders);

      // 插入订单数据并返回插入的数据
      return mainOrders;
  }

  // 生成采购商品单子订单数据
  async __generatePurchaseChildOrder({ goodsNo, specNum }) {
      let childOrders = [];
      for (let index = 1; index <= specNum; index++) {
        // 采购商品单编号生成规则： C(代表子订单) + 商品编号(0502020001) + 四位自然数递增(从0001开始) + E0STI4(6位随机UUID)
        const cid = 'C' + goodsNo + this.ctx.helper.prefixZero(index, 4) + this.ctx.helper.uuid(6, 36);
        childOrders.push({ cid });
      }
      childOrders = await this.service.purchaseOrder.insertPurchaseChildOrder(childOrders);

      // 插入订单数据并返回插入的数据
      return childOrders;
  }
}
