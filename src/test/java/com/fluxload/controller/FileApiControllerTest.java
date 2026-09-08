package com.fluxload.controller;

import com.fluxload.service.FileService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.io.TempDir;
import org.springframework.http.ResponseEntity;
import org.springframework.mock.web.MockMultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.util.List;
import java.util.Map;

import static org.junit.jupiter.api.Assertions.*;

class FileApiControllerTest {

    private FileApiController apiController;
    private FileService fileService;
    private Path tempDir;

    @BeforeEach
    void setUp(@TempDir Path tempDir) {
        this.tempDir = tempDir;
        this.fileService = new FileService(tempDir.toString());
        this.apiController = new FileApiController(fileService);
    }

    @Test
    void testListFiles() throws IOException {
        Files.createDirectory(tempDir.resolve("folder1"));
        Files.writeString(tempDir.resolve("file1.txt"), "hello");

        ResponseEntity<Map<String, Object>> response = apiController.listFiles("");
        assertNotNull(response);
        assertEquals(200, response.getStatusCode().value());

        Map<String, Object> body = response.getBody();
        assertNotNull(body);
        assertEquals("", body.get("current_path"));

        @SuppressWarnings("unchecked")
        List<Map<String, Object>> items = (List<Map<String, Object>>) body.get("items");
        assertEquals(2, items.size());

        boolean hasFolder = items.stream().anyMatch(i -> "folder1".equals(i.get("name")) && Boolean.TRUE.equals(i.get("is_directory")));
        boolean hasFile = items.stream().anyMatch(i -> "file1.txt".equals(i.get("name")) && Boolean.FALSE.equals(i.get("is_directory")));

        assertTrue(hasFolder);
        assertTrue(hasFile);
    }

    @Test
    void testUploadAndCreateDirAndRename() throws IOException {
        // Mkdir
        var mkdirRes = apiController.createDirectory("my_folder", "");
        assertEquals(200, mkdirRes.getStatusCode().value());
        assertTrue(Files.exists(tempDir.resolve("my_folder")));

        // Upload
        MockMultipartFile file = new MockMultipartFile("file", "doc.txt", "text/plain", "content".getBytes());
        var uploadRes = apiController.uploadFile(file, "my_folder");
        assertEquals(200, uploadRes.getStatusCode().value());
        assertTrue(Files.exists(tempDir.resolve("my_folder/doc.txt")));

        // Rename
        var renameRes = apiController.renameFile("my_folder/doc.txt", "renamed.txt");
        assertEquals(200, renameRes.getStatusCode().value());
        assertTrue(Files.exists(tempDir.resolve("my_folder/renamed.txt")));
        assertFalse(Files.exists(tempDir.resolve("my_folder/doc.txt")));

        // Delete
        var deleteRes = apiController.deleteFile("my_folder/renamed.txt");
        assertEquals(200, deleteRes.getStatusCode().value());
        assertFalse(Files.exists(tempDir.resolve("my_folder/renamed.txt")));
    }
}
