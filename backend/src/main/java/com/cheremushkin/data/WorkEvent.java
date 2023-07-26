package com.cheremushkin.data;

import com.cheremushkin.serializer.WorkEventSerializer;
import com.esotericsoftware.kryo.DefaultSerializer;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.extern.jackson.Jacksonized;

import java.time.ZonedDateTime;
import java.util.Map;

/**
 * Work event. Both come from UI and internal server events
 * are in this class
 */
@Data
@Builder
@Jacksonized
@AllArgsConstructor
@DefaultSerializer(WorkEventSerializer.class)
final public class WorkEvent {
    /**
     * Fired in: UI
     * Consumed in: ValidateFunction
     *
     * Sent when UI is started.
     * Event: Is sent to backend when UI is started, that means that user enters url in browser.
     * Parameters: SESSION_KEY - session key. Can be empty or
     * contain 8 hex digits.
     * Caller: backend.service
     *
     * Sent to backend when UI starts. Contains session key or empty
     * for new session.
     *
     * When user first time enter the site, key is empty. New key is obtained and UI is redirected.
     *
     * When user login to site not for the first time, key is already there. User saved the page
     * to bookmark with a key. All cards and settings are kept for this key.
     */
    public static final String UI_START_EVENT = "UI_START_EVENT";

    public static final String SESSION_KEY = "SESSION_KEY";

    /**
     * Internal Backend events
     */

    /**
     * Fired in: ValidateFunction
     * Consumed in: MainFunction
     * Parameters: SESSION_KEY - session key, generated in ValidationFunction
     * Sent when UI is started without key.
     * New UI session is started. Session id is generated on backend
     * and sent to UI. New key in backend map will be created.
     * UI will be redirected to new url with session key.
     */
    public static final String UI_START_WITHOUT_KEY_EVENT = "UI_START_WITHOUT_KEY_EVENT";
    /**
     * Fired in: ValidateFunction
     * Consumed in: MainFunction
     * Start UI with existing key. Key is validated. Map records are updated
     * with new login time.
     */
    public static final String UI_START_WITH_KEY_EVENT = "UI_START_WITH_KEY_EVENT";
    /**
     * Fired in: MainFunction
     * Consumed in: UI
     * Fired when new session is created. New session key is stored in backend and fired back to UI.
     * New session is created.
     */
    public static final String BACKEND_NEW_KEY_EVENT = "BACKEND_NEW_KEY_EVENT";
    /**
     * Fired in: UI
     * Consumed by: MainFunction
     * When create card button is pressed then this event arise. This event
     * requests card id from backend. Card id is same as key: 8 hex digits.
     */
    public static final String CARD_GET_ID_EVENT = "CARD_GET_ID_EVENT";
    /**
     * Fired in: MainFunction
     * Consumed by: UI
     * Arise in main function when new id is generated. After that it is send to UI
     */
    public static final String BACKEND_NEW_ID_EVENT = "BACKEND_NEW_ID_EVENT";
    /**
     * New card id. Is sent with BACKEND_NEW_ID_EVENT to UI.
     */
    public static final String ID = "ID";
    /**
     * Fired in: UI
     * Consumed in: MainFunction
     * Fired when card is updated. For example coordinates or
     * content is changed.
     */
    public static final String UPDATE_CARD_EVENT = "UPDATE_CARD_EVENT";
    /**
     * Fired in: UI
     * Consumed in; MainFunction
     * Delete card - move it to done. All cards are not deleted.
     * They are moved to archive.
     * Event data: ID = card id.
     */
    public static final String DELETE_CARD_EVENT = "DELETE_CARD_EVENT";

    /**
     * Card property of data
     */
    public static final String CARD = "CARD";

    /**
     * Error event, should be passed to UI when error occurs.
     * For example session key is invalid
     */
    private static final String ERROR_EVENT = "ERROR_EVENT";

    /**
     * Type of event. Returned from UI. Also filled on backend.
     * Backend specific events were here: Internal Backend events
     */
    String type;
    /**
     * Create time.
     */
    ZonedDateTime dateTime;
    /**
     * Data that is in event
     */
    Map<String, String> data;

    public static WorkEvent buildErrorEvent() {
        return WorkEvent.builder().type(WorkEvent.ERROR_EVENT).build();
    }

    public WorkEvent add(String key, String value) {
        data.put(key, value);
        return this;
    }

    public static WorkEventBuilder builder() {
        return new WorkEventCustomBuilder();
    }

    private static class WorkEventCustomBuilder extends WorkEventBuilder {
        @Override
        public WorkEvent build() {
            if (super.dateTime == null) super.dateTime = ZonedDateTime.now();
            return super.build();
        }
    }
}
