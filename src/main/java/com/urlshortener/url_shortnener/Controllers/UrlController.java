package com.urlshortener.url_shortnener.Controllers;

import com.urlshortener.url_shortnener.Entity.Url;
import com.urlshortener.url_shortnener.Repository.UrlRepository;
import com.urlshortener.url_shortnener.Util.Base62Encoder;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;


import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api")
public class UrlController {

    @Autowired
    private UrlRepository urlRepository;

    @PostMapping("/shorten")
    public Map<String, String> shortenUrl(@RequestBody Map<String, String> request) {

        String longUrl = request.get("url");

        // Save first to get ID
        Url url = new Url();
        url.setLongUrl(longUrl);

        Url savedUrl = urlRepository.save(url);

        // Encode ID
        String shortCode = Base62Encoder.encode(savedUrl.getId());

        // Save shortCode
        savedUrl.setShortCode(shortCode);
        urlRepository.save(savedUrl);

        String shortUrl = "http://localhost:8080/" + shortCode;

        Map<String, String> response = new HashMap<>();
        response.put("shortUrl", shortUrl);

        return response;
    }

    @GetMapping("/analytics/{shortCode}")
    public Map<String, Object> getAnalytics(@PathVariable String shortCode) {

        Url url = urlRepository.findByShortCode(shortCode)
                .orElseThrow(() -> new RuntimeException("URL not found"));

        Map<String, Object> response = new HashMap<>();
        response.put("shortCode", url.getShortCode());
        response.put("longUrl", url.getLongUrl());
        response.put("clickCount", url.getClickCount());

        return response;
    }
}