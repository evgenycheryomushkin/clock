package com.cheremushkin.data;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class Card {
    String id;
    public Card(String id) {
        if (id == null) throw new RuntimeException("id is null");
        this.id = id;
    }
}
