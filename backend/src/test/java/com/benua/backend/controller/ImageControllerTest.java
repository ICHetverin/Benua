package com.benua.backend.controller;

import com.benua.backend.model.Image;
import com.benua.backend.repository.ImageRepository;
import com.benua.backend.security.JwtService;
import com.benua.backend.security.UserDetailsServiceImpl;
import com.benua.backend.service.StorageService;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.mock.web.MockMultipartFile;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.test.web.servlet.MockMvc;

import java.util.Optional;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.delete;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.multipart;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@WebMvcTest(ImageController.class)
class ImageControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockitoBean
    private StorageService storageService;

    @MockitoBean
    private ImageRepository imageRepository;

    @MockitoBean
    private JwtService jwtService;

    @MockitoBean
    private UserDetailsServiceImpl userDetailsService;

    @Test
    @WithMockUser
    void uploadReturns201WithImageDto() throws Exception {
        StorageService.UploadedObject uploaded =
                new StorageService.UploadedObject("images/2024/01/uuid.jpg", "https://storage.example.com/img.jpg");
        when(storageService.upload(any())).thenReturn(uploaded);

        Image saved = new Image("img-1", "test.jpg", "https://storage.example.com/img.jpg", "images/2024/01/uuid.jpg");
        when(imageRepository.save(any())).thenReturn(saved);

        MockMultipartFile file = new MockMultipartFile(
                "file", "test.jpg", "image/jpeg", "fake-image-content".getBytes());

        mockMvc.perform(multipart("/admin/images").file(file))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$._id").value("img-1"))
                .andExpect(jsonPath("$.url_to_s3").value("https://storage.example.com/img.jpg"));
    }

    @Test
    void uploadWithoutAuthReturns401() throws Exception {
        MockMultipartFile file = new MockMultipartFile(
                "file", "test.jpg", "image/jpeg", "fake".getBytes());

        mockMvc.perform(multipart("/admin/images").file(file))
                .andExpect(status().isUnauthorized());
    }

    @Test
    @WithMockUser
    void deleteReturns404WhenImageNotFound() throws Exception {
        when(imageRepository.findById("missing")).thenReturn(Optional.empty());

        mockMvc.perform(delete("/admin/images/missing"))
                .andExpect(status().isNotFound());
    }
}
