package com.mitocode.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;


@Data
@NoArgsConstructor
@AllArgsConstructor
@EqualsAndHashCode(onlyExplicitlyIncluded = true)
@Entity
@Table(name = "vital_sign")
public class VitalSign {

    @Id
    @EqualsAndHashCode.Include
    private Integer idSign;

    @ManyToOne
    @JoinColumn(name = "id_patient", nullable = false, foreignKey = @ForeignKey(name = "FK_CONSULT_PATIENT"))
    private Patient patient;

    @Column(nullable = false, length = 60, unique = true)
    private String name;

    @Column(nullable = false, length = 10,  unique = true)
    private String abbreviation;

    @Column(nullable = false)
    private LocalDateTime vitalSignDate;

    @Column(nullable = false)
    private boolean enabled;

}
