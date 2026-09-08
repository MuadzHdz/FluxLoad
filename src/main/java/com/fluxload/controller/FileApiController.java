package com.fluxload.controller;

import com.fluxload.FluxLoadApplication;
import com.fluxload.service.FileService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.server.ResponseStatusException;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.util.*;

@RestController
@RequestMapping("/api/files")
public class FileApiController {

    private final FileService fileService;

    public FileApiController() {
        var config = FluxLoadApplication.getServerConfig();
        this.fileService = new FileService(
            config != null ? config.getDirectory() : System.getProperty("user.dir")
        );
    }

    public FileApiController(FileService fileService) {
        this.fileService = fileService;
    }

    @GetMapping
    public ResponseEntity<Map<String, Object>> listFiles(@RequestParam(required = false, defaultValue = "") String path) {
        if (!fileService.directoryExists(path)) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Invalid or inaccessible directory");
        }

        List<String> dirs = fileService.listDirectories(path);
        List<String> files = fileService.listFiles(path);
        String parentDir = fileService.getParentPath(path);

        List<Map<String, Object>> items = new ArrayList<>();

        for (String d : dirs) {
            Map<String, Object> item = new LinkedHashMap<>();
            String relPath = path.isEmpty() ? d : path + "/" + d;
            item.put("name", d);
            item.put("path", relPath);
            item.put("is_directory", true);
            item.put("size", 0L);
            try {
                Path dirPath = fileService.getFilePath(relPath);
                item.put("modified", Files.getLastModifiedTime(dirPath).toMillis());
            } catch (Exception e) {
                item.put("modified", 0L);
            }
            items.add(item);
        }

        for (String f : files) {
            Map<String, Object> item = new LinkedHashMap<>();
            String relPath = path.isEmpty() ? f : path + "/" + f;
            item.put("name", f);
            item.put("path", relPath);
            item.put("is_directory", false);
            try {
                Path filePath = fileService.getFilePath(relPath);
                item.put("size", Files.size(filePath));
                item.put("modified", Files.getLastModifiedTime(filePath).toMillis());
            } catch (Exception e) {
                item.put("size", 0L);
                item.put("modified", 0L);
            }
            items.add(item);
        }

        Map<String, Object> response = new LinkedHashMap<>();
        response.put("current_path", path);
        response.put("parent_path", parentDir);
        response.put("items", items);

        return ResponseEntity.ok(response);
    }

    @PostMapping("/upload")
    public ResponseEntity<Map<String, Object>> uploadFile(
            @RequestParam("file") MultipartFile file,
            @RequestParam(required = false, defaultValue = "") String path) throws IOException {
        String uploadedFilename = fileService.uploadFile(file, path);
        Map<String, Object> res = new HashMap<>();
        res.put("success", true);
        res.put("filename", uploadedFilename);
        res.put("path", path);
        return ResponseEntity.ok(res);
    }

    @PostMapping("/mkdir")
    public ResponseEntity<Map<String, Object>> createDirectory(
            @RequestParam String dirName,
            @RequestParam(required = false, defaultValue = "") String path) throws IOException {
        String created = fileService.createDirectory(path, dirName);
        Map<String, Object> res = new HashMap<>();
        res.put("success", true);
        res.put("dirName", created);
        return ResponseEntity.ok(res);
    }

    @PostMapping("/rename")
    public ResponseEntity<Map<String, Object>> renameFile(
            @RequestParam String filename,
            @RequestParam String newName) throws IOException {
        String renamed = fileService.renameFile(filename, newName);
        Map<String, Object> res = new HashMap<>();
        res.put("success", true);
        res.put("newName", renamed);
        return ResponseEntity.ok(res);
    }

    @DeleteMapping
    public ResponseEntity<Map<String, Object>> deleteFile(
            @RequestParam String filename) throws IOException {
        boolean deleted = fileService.deleteFile(filename);
        Map<String, Object> res = new HashMap<>();
        res.put("success", deleted);
        res.put("filename", filename);
        return ResponseEntity.ok(res);
    }
}
