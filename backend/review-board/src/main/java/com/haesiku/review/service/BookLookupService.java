package com.haesiku.review.service;

import com.fasterxml.jackson.databind.JsonNode;
import com.haesiku.review.dto.BookInfoDto;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.stream.Collectors;
import java.util.stream.StreamSupport;

@Service
public class BookLookupService {

    private static final String NL_API_URL = "http://seoji.nl.go.kr/landingPage/SearchApi.do?cert_key=%s&result_style=json&page_no=1&page_size=10&isbn=%s";
    private static final String OPEN_LIBRARY_URL = "https://openlibrary.org/api/books?bibkeys=ISBN:%s&format=json&jscmd=data";
    private static final String GOOGLE_BOOKS_URL = "https://www.googleapis.com/books/v1/volumes?q=isbn:%s";

    private final RestTemplate restTemplate = new RestTemplate();

    @Value("${nl.api.cert-key:}")
    private String nlCertKey;

    /**
     * 국립중앙도서관(인증키 설정 시) → Open Library → Google Books 순으로 ISBN에 해당하는 책 정보를 조회합니다.
     * @param isbn ISBN-10 또는 ISBN-13 (숫자와 하이픈만 사용)
     * @return 책 정보, 조회 실패 시 null
     */
    public BookInfoDto lookupByIsbn(String isbn) {
        String normalized = normalizeIsbn(isbn);
        if (normalized.isEmpty()) {
            return null;
        }

        BookInfoDto result = null;
        if (nlCertKey != null && !nlCertKey.isBlank()) {
            result = lookupFromNationalLibrary(normalized);
        }
        if (result == null) {
            result = lookupFromOpenLibrary(normalized);
        }
        if (result == null) {
            result = lookupFromGoogleBooks(normalized);
        }
        return result;
    }

    /**
     * 국립중앙도서관 Open API (ISBN 서지정보) 조회.
     * 응답: docs[] 또는 response.body.items.item[] 등 목록에서 첫 항목의 TITLE, AUTHOR 사용.
     */
    private BookInfoDto lookupFromNationalLibrary(String normalized) {
        if (nlCertKey == null || nlCertKey.isBlank()) {
            return null;
        }
        String url = String.format(NL_API_URL, nlCertKey.trim(), normalized);
        try {
            JsonNode root = restTemplate.getForObject(url, JsonNode.class);
            if (root == null) {
                return null;
            }

            JsonNode firstDoc = null;
            if (root.has("docs") && root.get("docs").isArray() && !root.get("docs").isEmpty()) {
                firstDoc = root.get("docs").get(0);
            } else if (root.has("response") && root.get("response").has("body")) {
                JsonNode body = root.get("response").get("body");
                if (body.has("items")) {
                    JsonNode items = body.get("items");
                    if (items.isArray() && !items.isEmpty()) {
                        firstDoc = items.get(0);
                    } else if (items.has("item")) {
                        JsonNode item = items.get("item");
                        firstDoc = item.isArray() ? item.get(0) : item;
                    }
                }
            } else if (root.has("data") && root.get("data").isArray() && !root.get("data").isEmpty()) {
                firstDoc = root.get("data").get(0);
            }

            if (firstDoc == null) {
                return null;
            }

            String title = textOrNull(firstDoc, "TITLE", "title", "bookname", "BOOKNAME");
            if (title == null || title.isBlank()) {
                return null;
            }

            String author = textOrNull(firstDoc, "AUTHOR", "author", "authors", "PUBLISHER", "publisher");
            if (author != null && author.isBlank()) {
                author = null;
            }

            String link = textOrNull(firstDoc, "url", "URL", "link", "LINK", "infoLink");
            if (link == null || link.isBlank()) {
                link = "https://www.nl.go.kr/NL/contents/N31101030500.do";
            }

            return new BookInfoDto(title, author, link);
        } catch (Exception e) {
            return null;
        }
    }

    private static String textOrNull(JsonNode node, String... keys) {
        for (String key : keys) {
            if (node.has(key)) {
                JsonNode v = node.get(key);
                if (v != null && !v.isNull()) {
                    if (v.isArray() && !v.isEmpty()) {
                        String joined = StreamSupport.stream(v.spliterator(), false)
                                .map(JsonNode::asText)
                                .filter(s -> s != null && !s.isBlank())
                                .collect(Collectors.joining(", "));
                        if (!joined.isBlank()) return joined;
                    } else {
                        String s = v.asText();
                        if (s != null && !s.isBlank()) return s;
                    }
                }
            }
        }
        return null;
    }

    private BookInfoDto lookupFromOpenLibrary(String normalized) {
        String url = String.format(OPEN_LIBRARY_URL, normalized);
        try {
            JsonNode root = restTemplate.getForObject(url, JsonNode.class);
            if (root == null) {
                return null;
            }

            JsonNode book = root.get("ISBN:" + normalized);
            if (book == null || book.isEmpty()) {
                return null;
            }

            String title = book.has("title") ? book.get("title").asText() : null;
            if (title == null || title.isBlank()) {
                return null;
            }

            String author = null;
            if (book.has("authors") && book.get("authors").isArray()) {
                author = StreamSupport.stream(book.get("authors").spliterator(), false)
                        .map(a -> a.has("name") ? a.get("name").asText() : "")
                        .filter(s -> !s.isBlank())
                        .collect(Collectors.joining(", "));
            }
            if (author != null && author.isBlank()) {
                author = null;
            }

            String link = book.has("url") ? book.get("url").asText() : null;
            if (link != null && link.isBlank()) {
                link = "https://openlibrary.org/isbn/" + normalized;
            } else if (link == null) {
                link = "https://openlibrary.org/isbn/" + normalized;
            }

            return new BookInfoDto(title, author, link);
        } catch (Exception e) {
            return null;
        }
    }

    private BookInfoDto lookupFromGoogleBooks(String normalized) {
        String url = String.format(GOOGLE_BOOKS_URL, normalized);
        try {
            JsonNode root = restTemplate.getForObject(url, JsonNode.class);
            if (root == null || !root.has("items") || !root.get("items").isArray()) {
                return null;
            }

            JsonNode items = root.get("items");
            if (items.isEmpty()) {
                return null;
            }

            JsonNode first = items.get(0);
            if (!first.has("volumeInfo")) {
                return null;
            }

            JsonNode vol = first.get("volumeInfo");
            String title = vol.has("title") ? vol.get("title").asText() : null;
            if (title == null || title.isBlank()) {
                return null;
            }

            String author = null;
            if (vol.has("authors") && vol.get("authors").isArray()) {
                author = StreamSupport.stream(vol.get("authors").spliterator(), false)
                        .map(JsonNode::asText)
                        .filter(s -> s != null && !s.isBlank())
                        .collect(Collectors.joining(", "));
            }
            if (author != null && author.isBlank()) {
                author = null;
            }

            String link = vol.has("infoLink") ? vol.get("infoLink").asText() : null;
            if (link == null || link.isBlank()) {
                link = "https://books.google.com/books?isbn=" + normalized;
            }

            return new BookInfoDto(title, author, link);
        } catch (Exception e) {
            return null;
        }
    }

    private static String normalizeIsbn(String isbn) {
        if (isbn == null) {
            return "";
        }
        return isbn.replaceAll("[^0-9]", "");
    }
}
