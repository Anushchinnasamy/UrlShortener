package com.urlshortener.url_shortnener.Controllers;

import com.urlshortener.url_shortnener.Entity.Url;
import com.urlshortener.url_shortnener.Service.UrlService;
import jakarta.servlet.http.HttpServletResponse;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

@RestController
public class RedirectController {

    private static final Logger log = LoggerFactory.getLogger(RedirectController.class);

    @Autowired
    private UrlService urlService;

    @GetMapping("/r/{shortCode}")
    public void redirectUrl(@PathVariable String shortCode,
                            HttpServletResponse response) throws Exception {

        log.info("Redirect requested for shortCode={}", shortCode);

        Url url = urlService.getOriginalUrl(shortCode);
        String longUrl = url.getLongUrl();

        if (longUrl == null || longUrl.isBlank()) {
            log.warn("Redirect blocked due to missing longUrl for shortCode={}", shortCode);
            response.sendError(HttpServletResponse.SC_NOT_FOUND);
            return;
        }

        response.sendRedirect(longUrl);
    }
}
