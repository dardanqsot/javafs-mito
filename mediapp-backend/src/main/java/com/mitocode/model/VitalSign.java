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
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer idSign;

    @ManyToOne
    @JoinColumn(name = "id_paciente", nullable = false, foreignKey = @ForeignKey(name = "FK_VITAL_SIGN"))
    private Patient patient;

    @Column(name = "vital_sign_date", nullable = true)
    private LocalDateTime vitalSignDate;

    @Column(name = "temperature", nullable = true)
    private String temperature;

    @Column(name = "pulse", nullable = true)
    private String pulse;

    @Column(name = "respiratory_rate", nullable = true)
    private String respiratoryRate;
}
