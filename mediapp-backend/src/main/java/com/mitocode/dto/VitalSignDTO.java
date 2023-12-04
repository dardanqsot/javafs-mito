package com.mitocode.dto;

import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@AllArgsConstructor
@NoArgsConstructor
@EqualsAndHashCode(onlyExplicitlyIncluded = true)
public class VitalSignDTO {

    @EqualsAndHashCode.Include
    private Integer idSign;

    @NotNull
    private PatientDTO patient;

    @NotNull
    private LocalDateTime vitalSignDate;

    @NotNull
    private String temperature;

    @NotNull
    private String pulse;

    @NotNull
    private String respiratoryRate;
}
