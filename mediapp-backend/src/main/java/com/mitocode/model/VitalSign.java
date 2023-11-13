package com.mitocode.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;


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

    @Column(nullable = false, length = 60, unique = true)
    private String name;

    @Column(nullable = false, length = 10,  unique = true)
    private String abbreviation;

    @Column(nullable = false)
    private boolean enabled;

}
