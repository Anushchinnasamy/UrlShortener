package com.urlshortener.url_shortener.Service;

import com.urlshortener.url_shortener.Entity.Url;
import com.urlshortener.url_shortener.Exceptions.BadRequestException;
import com.urlshortener.url_shortener.Exceptions.ResourceNotFoundException;
import com.urlshortener.url_shortener.Repository.UrlRepository;
import com.urlshortener.url_shortener.Util.Base62Encoder;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.Map;
import java.util.concurrent.TimeUnit;

@Service
public class UrlService {

    private static final Logger log = LoggerFactory.getLogger(UrlService.class);

    @Autowired
    private UrlRepository urlRepository;

    @Autowired
    private RedisTemplate<String, String> redisTemplate;

    @Value("${app.base-url:http://localhost:8080}")
    private String baseUrl;

    public Map<String, String> createShortUrl(String longUrl) {

        if (longUrl == null || longUrl.isBlank()) {
            throw new BadRequestException("URL is required");
        }

        // Save URL first
        Url url = new Url();
        url.setLongUrl(longUrl);
        url.setClickCount(0L);

        Url savedUrl = urlRepository.save(url);

        // Generate short code
        String shortCode = Base62Encoder.encode(savedUrl.getId());

        // Save short code
        savedUrl.setShortCode(shortCode);
        urlRepository.save(savedUrl);

        String shortUrl = baseUrl.replaceAll("/+$", "") + "/r/" + shortCode;

        Map<String, String> response = new HashMap<>();
        response.put("shortUrl", shortUrl);

        return response;
    }

    public Url getOriginalUrl(String shortCode) {

        if (shortCode == null || shortCode.isBlank()) {
            throw new BadRequestException("shortCode is required");
        }

        // 1. Check Redis
        String cachedUrl = null;
        try {
            cachedUrl = redisTemplate.opsForValue().get(shortCode);
            log.debug("Redis lookup shortCode={} hit={}", shortCode, cachedUrl != null);
        } catch (Exception ex) {
            // Redis is an optional layer; never break redirect/analytics because of it.
            log.warn("Redis lookup failed for shortCode={}: {}", shortCode, ex.getMessage());
        }

        Url url;

        url = urlRepository.findByShortCode(shortCode)
                .orElseThrow(() -> new ResourceNotFoundException("URL not found"));

        // Cache longUrl when missing/blank in cache (best-effort).
        if (cachedUrl == null) {
            try {
                if (url.getLongUrl() != null && !url.getLongUrl().isBlank()) {
                    redisTemplate.opsForValue().set(shortCode, url.getLongUrl(), 10, TimeUnit.MINUTES);
                    log.debug("Redis set shortCode={} ttlMinutes=10", shortCode);
                }
            } catch (Exception ex) {
                log.warn("Redis set failed for shortCode={}: {}", shortCode, ex.getMessage());
            }
        }

        // 2. ALWAYS increment click count
        url.setClickCount(
                (url.getClickCount() == null ? 0 : url.getClickCount()) + 1
        );

        log.info("Redirect resolved shortCode={} clickCount={}", shortCode, url.getClickCount());

        urlRepository.save(url);

        return url;
    }

    public Map<String, Object> getAnalytics(String shortCode) {

        Url url = urlRepository.findByShortCode(shortCode)
                .orElseThrow(() -> new ResourceNotFoundException("URL not found"));

        Map<String, Object> response = new HashMap<>();
        response.put("shortCode", url.getShortCode());
        response.put("longUrl", url.getLongUrl());
        response.put("clickCount", url.getClickCount());

        return response;
    }
}