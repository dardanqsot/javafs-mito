package com.mitocode.service;

import com.mitocode.model.VitalSign;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

public interface IVitalSignService extends ICRUD<VitalSign, Integer> {
    Page<VitalSign> listPageable(Pageable pageable);

}
