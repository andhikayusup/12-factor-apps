/*
 * This Java source file was generated by the Gradle 'init' task.
 */
package factor.apps;

import com.google.gson.Gson;

import static spark.Spark.*;

public class App {

    public static void main(String[] args) {
        Gson gson = new Gson();

        get("/hello", "application/json", (req, res) -> {
            res.type("application/json");
            return gson.toJson(new Message("Hello, World!"));
        });
    }

    public static class Message {
        private final String message;

        public Message(String message) {
            this.message = message;
        }

        public String getMessage() {
            return message;
        }
    }
}
