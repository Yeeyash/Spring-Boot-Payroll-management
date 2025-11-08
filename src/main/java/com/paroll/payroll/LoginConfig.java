package com.paroll.payroll;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;

// @Controller
// public class LoginConfig {
    
//     @GetMapping("/user/login")
//     public String userLogin(){
//         return "user/login";
//     }

//     @GetMapping("/admin/login")
//     public String adminLogin(){
//         return "admin/login";
//     }

//     @GetMapping("/user/index")
//     public String userIndex(){
//         return "user/index";
//     }

// }

@Controller
@RequestMapping("/user")
public class LoginConfig {
    @GetMapping("/{page}")
    public String renderPage(@PathVariable String page){
        return "user/" + page;
    }
}