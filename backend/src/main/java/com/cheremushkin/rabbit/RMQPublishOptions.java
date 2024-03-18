package com.cheremushkin.rabbit;

import com.cheremushkin.data.ClockEnvelope;
import com.cheremushkin.data.ClockEvent;
import com.rabbitmq.client.AMQP;
import org.apache.flink.streaming.connectors.rabbitmq.RMQSinkPublishOptions;

public class RMQPublishOptions implements RMQSinkPublishOptions<ClockEnvelope> {
    @Override
    public String computeRoutingKey(ClockEnvelope clockEnvelope) {
        return clockEnvelope.getReplyTo();
    }

    @Override
    public AMQP.BasicProperties computeProperties(ClockEnvelope a) {
        return null;
    }

    @Override
    public String computeExchange(ClockEnvelope a) {
        return "";
    }
}
