package com.urlshortener.url_shortener.Controllers;



import com.urlshortener.url_shortener.Service.UrlService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api")
public class UrlController {

    private static final Logger log = LoggerFactory.getLogger(UrlController.class);

    @Autowired
    private UrlService urlService;

    @PostMapping("/shorten")
    public Map<String, String> shortenUrl(@RequestBody com.urlshortener.url_shortener.DTO.CreateShortUrlRequest request) {
        log.info("Shorten request received");
        return urlService.createShortUrl(request.getUrl());
    }

    @GetMapping("/analytics/{shortCode}")
    public Map<String, Object> getAnalytics(@PathVariable String shortCode) {
        log.info("Analytics request shortCode={}", shortCode);
        return urlService.getAnalytics(shortCode);
    }


}