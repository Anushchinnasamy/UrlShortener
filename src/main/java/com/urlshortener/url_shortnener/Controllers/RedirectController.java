package com.urlshortener.url_shortnener.Controllers;

import com.urlshortener.url_shortnener.Entity.Url;
import com.urlshortener.url_shortnener.Service.UrlService;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

@RestController
public class RedirectController {

    @Autowired
    private UrlService urlService;

    @GetMapping("/{shortCode}")
    public void redirectUrl(@PathVariable String shortCode,
                            HttpServletResponse response) throws Exception {

        Url url = urlService.getOriginalUrl(shortCode);
        response.sendRedirect(url.getLongUrl());
    }
}