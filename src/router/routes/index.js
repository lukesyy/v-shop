const routes = [
  {
    path: '/',
    redirect: '/home',
  },
  {
    path: '/home',
    name: 'home',
    component: () => import(/* webpackChunkName: "manifest" */ '@/views/home/index.vue'),
    meta: {
      title: '首页',
    },
  },
  {
    path: '/category',
    name: 'category',
    component: () => import(/* webpackChunkName: "manifest" */ '@/views/category/index.vue'),
    meta: {
      title: '分类',
    },
  },
  {
    path: '/cart',
    name: 'cart',
    component: () => import(/* webpackChunkName: "manifest" */ '@/views/cart/index.vue'),
    meta: {
      title: '购物车',
    },
  },
  {
    path: '/mine',
    name: 'mine',
    component: () => import(/* webpackChunkName: "manifest" */ '@/views/mine/index.vue'),
    meta: {
      title: '我的',
    },
  },
  {
    path: '/login',
    name: 'login',
    component: () => import(/* webpackChunkName: "manifest" */ '@/views/login/index.vue'),
    meta: {
      title: '登录',
    },
  },
  {
    path: '/register',
    name: 'register',
    component: () => import(/* webpackChunkName: "manifest" */ '@/views/register/index.vue'),
    meta: {
      title: '注册',
      headReturn: true,
    },
  },
  {
    path: '/resetPwd',
    name: 'resetPwd',
    component: () => import(/* webpackChunkName: "manifest" */ '@/views/resetPwd/index.vue'),
    meta: {
      title: '重置密码',
      headReturn: true,
    },
  },
  {
    path: '/order/list',
    name: 'orderList',
    component: () => import('@/views/order/list.vue'),
    meta: {
      title: '订单列表',
      headReturn: true,
    },
  },
  {
    path: '/order/detail',
    name: 'orderDetail',
    component: () => import('@/views/order/detail.vue'),
    meta: {
      title: '订单详情',
      headReturn: true,
    },
  },
  {
    path: '/order/submit',
    name: 'orderSubmit',
    component: () => import('@/views/order/submit.vue'),
    meta: {
      title: '提交订单',
      headReturn: true,
    },
  },
  {
    path: '/order/payResult',
    name: 'orderPayResult',
    component: () => import('@/views/order/payResult.vue'),
    meta: {
      title: '支付结果',
      headReturn: true,
    },
  },
  {
    path: '/refund',
    name: 'refund',
    component: () => import('@/views/refund/index.vue'),
    meta: {
      title: '退款/售后',
      headReturn: true,
    },
  },
  {
    path: '/refund/apply',
    name: 'refundApply',
    component: () => import('@/views/refund/apply.vue'),
    meta: {
      title: '申请售后',
      headReturn: true,
    },
  },
  {
    path: '/coupon',
    name: 'coupon',
    component: () => import('@/views/coupon/index.vue'),
    meta: {
      title: '我的优惠券',
      headReturn: true,
    },
  },
  {
    path: '/integral',
    name: 'integral',
    component: () => import('@/views/integral/index.vue'),
    meta: {
      title: '积分中心',
      headReturn: true,
    },
  },
  {
    path: '/integral/rule',
    name: 'integralRule',
    component: () => import('@/views/integral/rule.vue'),
    meta: {
      title: '积分规则',
      headReturn: true,
    },
  },
  {
    path: '/integral/scoreLog',
    name: 'integralScoreLog',
    component: () => import('@/views/integral/scoreLog.vue'),
    meta: {
      title: '积分明细',
      headReturn: true,
    },
  },
  {
    path: '/integral/exchange',
    name: 'integralExchange',
    component: () => import('@/views/integral/exchange.vue'),
    meta: {
      title: '积分兑换',
      headReturn: true,
    },
  },
  {
    path: '/wallet',
    name: 'wallet',
    component: () => import('@/views/wallet/index.vue'),
    meta: {
      title: '我的钱包（资产）',
      headReturn: true,
    },
  },
  {
    path: '/wallet/cashLog',
    name: 'walletCashLog',
    component: () => import('@/views/wallet/cashLog.vue'),
    meta: {
      title: '资金记录',
      headReturn: true,
    },
  },
  {
    path: '/address',
    name: 'address',
    component: () => import('@/views/address/index.vue'),
    meta: {
      title: '收货地址',
      headReturn: true,
    },
  },
  {
    path: '/address/edit',
    name: 'addressEdit',
    component: () => import('@/views/address/edit.vue'),
    meta: {
      title: '编辑收货地址',
      headReturn: true,
    },
  },
  {
    path: '/good/detail',
    name: 'goodDetail',
    component: () => import('@/views/good/detail.vue'),
    meta: {
      title: '商品详情',
      headReturn: true,
    },
  },
  {
    path: '/good/reputation',
    name: 'goodReputation',
    component: () => import('@/views/good/reputation.vue'),
    meta: {
      title: '全部评价',
      headReturn: true,
    },
  },
  {
    path: '/setting',
    name: 'setting',
    component: () => import('@/views/setting/index.vue'),
    meta: {
      title: '设置',
      headReturn: true,
    },
  },
  {
    path: '/profile',
    name: 'profile',
    component: () => import('@/views/profile/index.vue'),
    meta: {
      title: '编辑资料',
      headReturn: true,
    },
  },
  {
    path: '/theme',
    name: 'theme',
    component: () => import('@/views/theme/index.vue'),
    meta: {
      title: '主题风格',
      headReturn: true,
    },
  },
  // errorPage
  {
    path: '/reload',
    component: () => import(/* webpackChunkName: "manifest" */ '@/views/error/reload.vue'),
    meta: {
      title: '加载异常',
      headReturn: true,
    },
  },
  {
    path: '/404',
    component: () => import(/* webpackChunkName: "manifest" */ '@/views/error/404.vue'),
    meta: {
      title: '找不到页面',
      headReturn: true,
    },
  },
  // 404 Not found
  { path: '*', redirect: '/404' },
]

export default routes
