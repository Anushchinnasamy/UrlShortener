package com.urlshortener.url_shortnener.Controllers;



import com.urlshortener.url_shortnener.Service.UrlService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api")
public class UrlController {

    @Autowired
    private UrlService urlService;

    @PostMapping("/shorten")
    public Map<String, String> shortenUrl(@RequestBody com.urlshortener.url_shortnener.DTO.CreateShortUrlRequest request) {
        return urlService.createShortUrl(request.getUrl());
    }

    @GetMapping("/analytics/{shortCode}")
    public Map<String, Object> getAnalytics(@PathVariable String shortCode) {
        return urlService.getAnalytics(shortCode);
    }


}