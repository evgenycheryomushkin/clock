package com.cheremushkin.processor.main;

import org.apache.flink.api.common.state.MapState;

import java.util.HashMap;
import java.util.Iterator;
import java.util.Map;

public class TestMapState<UK, UV> implements MapState<UK, UV> {
    final Map<UK, UV> map = new HashMap<>();

    @Override
    public UV get(UK key) throws Exception {
        return map.get(key);
    }

    @Override
    public void put(UK key, UV value) throws Exception {
        map.put(key, value);
    }

    @Override
    public void putAll(Map<UK, UV> map) throws Exception {
        this.map.putAll(map);
    }

    @Override
    public void remove(UK key) throws Exception {
        map.remove(key);
    }

    @Override
    public boolean contains(UK key) throws Exception {
        return map.containsKey(key);
    }

    @Override
    public Iterable<Map.Entry<UK, UV>> entries() throws Exception {
        return map.entrySet();
    }

    @Override
    public Iterable<UK> keys() throws Exception {
        return map.keySet();
    }

    @Override
    public Iterable<UV> values() throws Exception {
        return map.values();
    }

    @Override
    public Iterator<Map.Entry<UK, UV>> iterator() throws Exception {
        return map.entrySet().iterator();
    }

    @Override
    public boolean isEmpty() throws Exception {
        return map.isEmpty();
    }

    @Override
    public void clear() {
        map.clear();
    }
}
