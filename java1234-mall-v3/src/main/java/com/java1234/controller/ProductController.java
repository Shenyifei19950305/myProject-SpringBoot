package com.java1234.controller;


import com.baomidou.mybatisplus.core.conditions.query.QueryWrapper;
import com.java1234.entity.Product;
import com.java1234.entity.R;
import com.java1234.service.IProductService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.HashMap;
import java.util.List;

//商品Controller

@RestController
@RequestMapping("/product")
public class ProductController {
    @Autowired
    private IProductService productService;
    @GetMapping("/findSwiper")
    public R findSwiper(){
        List<Product> swipperProductList = productService.list(new QueryWrapper<Product>().eq("isSwiper", true).orderByAsc("swiperSort"));
        HashMap<String, Object> map = new HashMap<>();
        map.put("message",swipperProductList);
        return R.ok(map);
    }

}
