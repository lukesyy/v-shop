import request from '@/utils/http/request';

/**
 * 加入购物车
 */
export function shoppingCartAdd(data) {
  return request({
    url: `/channel/cart/add`,
    method: 'post',
    data,
  });
}

/**
 * 清空购物车
 */
export function shoppingCartEmpty(data) {
  return request({
    url: `/channel/cart/removeAll`,
    method: 'post',
    data,
  });
}

/**
 * 读取购物车数据
 */
export function shoppingCartInfo(data) {
  return request({
    url: `/channel/cart/goods`,
    method: 'get',
    params: data,
  });
}
/**
 * 获取购物车商品数量
 */
export function shoppingCartTotal(data) {
  return request({
    url: `/channel/cart/total`,
    method: 'get',
    params: data,
  });
}

/**
 * 购物车修改购买数量
 */
export function shoppingCartModifyNumber(data) {
  return request({
    url: `/channel/cart/edit`,
    method: 'post',
    data,
  });
}

/**
 * 移除购物车中某条记录
 */
export function shoppingCartRemove(data) {
  return request({
    url: `/channel/cart/remove`,
    method: 'post',
    data,
  });
}

/**
 * 购物车修改选中状态
 */
export function shoppingCartSelect(data) {
  return request({
    url: `/shopping-cart/select`,
    method: 'post',
    data,
  });
}

export default {
  shoppingCartAdd,
  shoppingCartEmpty,
  shoppingCartInfo,
  shoppingCartModifyNumber,
  shoppingCartRemove,
  shoppingCartSelect,
  shoppingCartTotal
};
