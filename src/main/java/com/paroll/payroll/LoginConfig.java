package com.paroll.payroll;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;

@Controller
public class LoginConfig {
    
    @GetMapping("/user/login")
    public String userLogin(){
        return "user/login";
    }

    @GetMapping("/admin/login")
    public String adminLogin(){
        return "admin/login";
    }

}
