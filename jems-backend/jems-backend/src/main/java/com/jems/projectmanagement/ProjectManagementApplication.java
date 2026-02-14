package com.jems.projectmanagement;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.data.mongodb.config.EnableMongoAuditing;

@SpringBootApplication
@EnableMongoAuditing
public class ProjectManagementApplication {

    public static void main(String[] args) {
        SpringApplication.run(ProjectManagementApplication.class, args);
    }
}
// cloudinary secert key : CgV5WKqTLVEOJUnU4T2uAGzeeic
// API key : 632723871821149
// cloud name :
// API name :
//JEMS
//url for API : CLOUDINARY_URL=cloudinary://<your_api_key>:<your_api_secret>@djmf8hahq