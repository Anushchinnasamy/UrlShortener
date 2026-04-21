package com.urlshortener.url_shortnener.Service;

import com.urlshortener.url_shortnener.Entity.Url;
import com.urlshortener.url_shortnener.Repository.UrlRepository;
import com.urlshortener.url_shortnener.Util.Base62Encoder;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.Map;

@Service
public class UrlService {

    @Autowired
    private UrlRepository urlRepository;

    public Map<String, String> createShortUrl(String longUrl) {

        // Save URL first
        Url url = new Url();
        url.setLongUrl(longUrl);

        Url savedUrl = urlRepository.save(url);

        // Generate short code
        String shortCode = Base62Encoder.encode(savedUrl.getId());

        // Save short code
        savedUrl.setShortCode(shortCode);
        urlRepository.save(savedUrl);

        String shortUrl = "http://localhost:8080/" + shortCode;

        Map<String, String> response = new HashMap<>();
        response.put("shortUrl", shortUrl);

        return response;
    }

    public Url getOriginalUrl(String shortCode) {

        Url url = urlRepository.findByShortCode(shortCode)
                .orElseThrow(() -> new RuntimeException("URL not found"));

        // Increment click count
        url.setClickCount(url.getClickCount() + 1);
        urlRepository.save(url);

        return url;
    }

    public Map<String, Object> getAnalytics(String shortCode) {

        Url url = urlRepository.findByShortCode(shortCode)
                .orElseThrow(() -> new RuntimeException("URL not found"));

        Map<String, Object> response = new HashMap<>();
        response.put("shortCode", url.getShortCode());
        response.put("longUrl", url.getLongUrl());
        response.put("clickCount", url.getClickCount());

        return response;
    }
}