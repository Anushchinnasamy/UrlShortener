package com.urlshortener.url_shortnener.Controllers;

import com.urlshortener.url_shortnener.Entity.Url;
import com.urlshortener.url_shortnener.Repository.UrlRepository;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

@RestController
public class RedirectController {

    @Autowired
    private UrlRepository urlRepository;

    @GetMapping("/{shortCode}")
    public void redirectUrl(@PathVariable String shortCode,
                            HttpServletResponse response) throws Exception {

        Url url = urlRepository.findByShortCode(shortCode)
                .orElseThrow(() -> new RuntimeException("URL not found"));

        // Increment click count
        url.setClickCount(url.getClickCount() + 1);
        urlRepository.save(url);

        // Redirect
        response.sendRedirect(url.getLongUrl());
    }
}