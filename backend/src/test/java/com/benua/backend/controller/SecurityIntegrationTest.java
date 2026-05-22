package com.benua.backend.controller;

import com.benua.backend.dto.BuildingDto;
import com.benua.backend.security.JwtService;
import com.benua.backend.security.UserDetailsServiceImpl;
import com.benua.backend.service.BuildingService;
import com.benua.backend.service.PersonService;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.http.MediaType;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.test.web.servlet.MockMvc;

import java.util.List;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyBoolean;
import static org.mockito.ArgumentMatchers.anyInt;
import static org.mockito.Mockito.doNothing;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@WebMvcTest({BuildingController.class, PersonController.class})
class SecurityIntegrationTest {

    @Autowired
    private MockMvc mockMvc;

    @MockitoBean
    private JwtService jwtService;

    @MockitoBean
    private UserDetailsServiceImpl userDetailsService;

    @MockitoBean
    private BuildingService buildingService;

    @MockitoBean
    private PersonService personService;

    @Test
    void getObjectsAnonymouslyReturns200WithOnlyPublished() throws Exception {
        when(buildingService.getBuildingsDto(any(), anyInt(), anyInt(), anyBoolean()))
                .thenReturn(List.of());

        mockMvc.perform(get("/objects"))
                .andExpect(status().isOk());
    }

    @Test
    void postObjectWithoutTokenReturns401() throws Exception {
        mockMvc.perform(post("/objects")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{\"name\":\"T\",\"address\":\"A\",\"latitude\":55.0,\"longitude\":37.0}"))
                .andExpect(status().isUnauthorized());
    }

    @Test
    void putObjectWithoutTokenReturns401() throws Exception {
        mockMvc.perform(put("/objects/some-id")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{}"))
                .andExpect(status().isUnauthorized());
    }

    @Test
    void deleteObjectWithoutTokenReturns401() throws Exception {
        mockMvc.perform(delete("/objects/some-id"))
                .andExpect(status().isUnauthorized());
    }

    @Test
    @WithMockUser(roles = "EDITOR")
    void editorCanCreateBuilding() throws Exception {
        BuildingDto dto = new BuildingDto(
                "id", "Test", "Addr", 55.0f, 37.0f, null, null, null, null, null,
                List.of(), List.of(), List.of(), List.of(), List.of(), List.of(),
                0, true, null, null);
        when(buildingService.createBuilding(any())).thenReturn(dto);

        mockMvc.perform(post("/objects")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{\"name\":\"Test\",\"address\":\"Addr\",\"latitude\":55.0,\"longitude\":37.0}"))
                .andExpect(status().isCreated());
    }

    @Test
    @WithMockUser(roles = "EDITOR")
    void editorCannotDeletePerson() throws Exception {
        mockMvc.perform(delete("/persons/some-id"))
                .andExpect(status().isForbidden());
    }

    @Test
    @WithMockUser(roles = "ADMIN")
    void adminCanDeletePerson() throws Exception {
        doNothing().when(personService).deletePerson("some-id");

        mockMvc.perform(delete("/persons/some-id"))
                .andExpect(status().isNoContent());
    }
}
