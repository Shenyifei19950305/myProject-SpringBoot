
// pages/order-confirm/order-confirm.js

import { hideLoading, msg, navTo, redirectTo, showLoading } from "@/utils/util"
import { addOrder } from '@/api/order'

Page({

    data: {
        orderData: {}, // 订单数据
        selfTakeType: 1, // 自取类型：1-堂食，2外带 默认是1
        showRemark: false,
        remark: '', // 备注信息
    },

    onLoad(options) {
        // console.log('options', JSON.parse(options.orderData))
        if (options.orderData) {
           const orderData = JSON.parse(options.orderData)
           this.setData({ orderData })
        }
    },

    // 切换自取类型：1堂食，2外带
    changeSelfTakeType(e) {
        const {value} = e.currentTarget.dataset
        this.setData({ selfTakeType: value})
        // console.log('value', value)
    },

    // 选择收货地址：前往收货地址页面
    toSelectAddress() {
        navTo("/pages/address-list/address-list", {
            events: {
                updateAddress: (address) => {
                    this.setData({
                        'orderData.address': address
                    })
                }
            }
        })
    },

    // 确认备注的输入
    confirmRemark(e) {
        const {remark} = e.detail.value
        this.setData({ remark })
        this.closeRemark()
        // console.log('confirmRemark', remark)
    },

    // 关闭备注弹出层
    closeRemark() {
        this.setData({ showRemark: false })
    },

    // 打开备注弹出层
    openRemark() {
        this.setData({ showRemark: true })
    },

    // 提交订单
    async submitOrder() {
        const {takeType, address} = this.data.orderData
        // 判断如果是 2外送，则必须要有收货地址
        if (takeType == 2 && (!address || !address._id)) {
            return msg('请选择收货地址')
        }

        try {
            showLoading('提交中', {mask: true})

            // 封装要保存的订单数据
            const { orderData, selfTakeType, remark } = this.data
            const { _id: shopId, name: shopName } = orderData.shop
            const data = {
                ...orderData, 
                selfTakeType, remark, shopId, shopName, 
                state: 1 // 1-待支付 ，2-已支付，3-已完成，4-已取消
            }

            // console.log(" data" , data)
            // 调用接口新增订单数据
            const { result } = await addOrder(data)
            // console.log('result', result)

            // 重定向到支付页面，它会关闭当前页面
            redirectTo('/pages/payment/payment?orderId='+ result._id, {
                complete: () => {
                    hideLoading()
                    // 跳转完成，触发来shopping页面中的清空购物车事件
                    const eventChannel = this.getOpenerEventChannel()
                    eventChannel.emit('clearCartData')
                }
            })
        } catch (error) {
            console.error("提交订单数据失败", error)
            hideLoading()
        } finally {
        }

    }

})