package com.urlshortener.url_shortener.Repository;

import com.urlshortener.url_shortener.Entity.Url;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface UrlRepository extends JpaRepository<Url, Long> {

    Optional<Url> findByShortCode(String shortCode);
}
