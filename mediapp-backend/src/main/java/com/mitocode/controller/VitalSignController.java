package com.mitocode.controller;

import com.mitocode.dto.VitalSignDTO;
import com.mitocode.model.VitalSign;
import com.mitocode.service.IVitalSignService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;


@RestController
@RequestMapping("/vitalsign")
@RequiredArgsConstructor
public class VitalSignController {
    
    private final IVitalSignService service;
    @Qualifier("defaultMapper")
    private final ModelMapper mapper;
    
    @GetMapping
    public ResponseEntity<List<VitalSignDTO>> findAll(){
        List<VitalSignDTO> lst = service.findAll().stream().map(this::convertToDto).toList();
        return new ResponseEntity<>(lst, HttpStatus.OK);
    }

    @GetMapping("/{id}")
    public ResponseEntity<VitalSignDTO> findById(@PathVariable("id") Integer id){
        VitalSign obj = service.findById(id);
        return new ResponseEntity<>(convertToDto(obj), HttpStatus.OK);
    }

    @GetMapping("/pageable")
    public ResponseEntity<Page<VitalSign>> listarPageable(Pageable pageable) {
        Page<VitalSign> signos = service.listPageable(pageable);
        return new ResponseEntity<Page<VitalSign>>(signos, HttpStatus.OK);
    }

    @PostMapping
    public ResponseEntity<VitalSignDTO> save(@Valid @RequestBody VitalSignDTO dto){
        VitalSign obj = service.save(convertToEntity(dto));
        return new ResponseEntity<>(convertToDto(obj), HttpStatus.OK);
    }

    @PutMapping("/{id}")
    public ResponseEntity<VitalSignDTO> update(@Valid @PathVariable("id") Integer id, @RequestBody VitalSignDTO dto) throws Exception {
        VitalSign obj = service.update(convertToEntity(dto), id);
        return new ResponseEntity<>(convertToDto(obj), HttpStatus.OK);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable("id") Integer id){
        service.delete(id);
        return new ResponseEntity<>(HttpStatus.NO_CONTENT);
    }

    private VitalSignDTO convertToDto(VitalSign obj){
        return mapper.map(obj, VitalSignDTO.class);
    }

    private VitalSign convertToEntity(VitalSignDTO dto){
        return mapper.map(dto, VitalSign.class);
    }
}
