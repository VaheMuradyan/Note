package main

import (
	"context"
	"fmt"
	"log"
	"os"

	"github.com/gofiber/fiber/v2"
	"github.com/joho/godotenv"
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"
	"go.mongodb.org/mongo-driver/mongo"
	"go.mongodb.org/mongo-driver/mongo/options"
)

type Note struct {
	ID      primitive.ObjectID `json:"id,omitempty" bson:"_id,omitempty"`
	Changed bool               `json:"changed"`
	Body    string             `json:"body"`
}

var collection *mongo.Collection

func main() {
	fmt.Println("Hello world")

	err := godotenv.Load(".env")
	if err != nil {
		log.Fatal("Error loading .env file:", err)
	}

	MONGODB_URI := os.Getenv("MONGODB_URI")
	clientOptions := options.Client().ApplyURI(MONGODB_URI)
	client, err := mongo.Connect(context.Background(), clientOptions)

	if err != nil {
		log.Fatal(err)
	}

	defer client.Disconnect(context.Background())

	err = client.Ping(context.Background(), nil)
	if err != nil {
		log.Fatal(err)
	}

	fmt.Println("Connected to Mongodb ATLAS")

	collection = client.Database("golang_db").Collection("notes")

	app := fiber.New()

	app.Get("/api/notes", getNotes)
	app.Post("/api/notes", createNote)
	app.Patch("/api/notes/:id", updateNote)
	app.Delete("/api/notes/:id", deleteNote)

	port := os.Getenv("PORT")

	if port == "" {
		port = "5000"
	}

	log.Fatal(app.Listen("0.0.0.0:" + port))
}

func getNotes(c *fiber.Ctx) error {
	var notes []Note

	cursor, err := collection.Find(context.Background(), bson.M{})

	if err != nil {
		return err
	}

	defer cursor.Close(context.Background())

	for cursor.Next(context.Background()) {
		var note Note
		if err := cursor.Decode(&note); err != nil {
			return err
		}
		notes = append(notes, note)
	}

	return c.JSON(notes)
}

func createNote(c *fiber.Ctx) error {
	note := new(Note)

	if err := c.BodyParser(note); err != nil {
		return err
	}

	if note.Body == "" {
		return c.Status(400).JSON(fiber.Map{"error": "Note body cannot be empty"})
	}

	insertResult, err := collection.InsertOne(context.Background(), note)

	if err != nil {
		return err
	}

	note.ID = insertResult.InsertedID.(primitive.ObjectID)

	return c.Status(201).JSON(note)
}

func updateNote(c *fiber.Ctx) error {
	id := c.Params("id")

	objectId, err := primitive.ObjectIDFromHex(id)

	if err != nil {
		return c.Status(400).JSON(fiber.Map{"error": "Ivalid note ID"})
	}

	filter := bson.M{"_id": objectId}
	update := bson.M{"$set": bson.M{"changed": true}}

	_, err = collection.UpdateOne(context.Background(), filter, update)

	if err != nil {
		return err
	}

	return c.Status(200).JSON(fiber.Map{"success": true})
}

func deleteNote(c *fiber.Ctx) error {
	id := c.Params("id")

	objectId, err := primitive.ObjectIDFromHex(id)

	if err != nil {
		return c.Status(400).JSON(fiber.Map{"error": "Invalid note id"})
	}
	filter := bson.M{"_id": objectId}
	_, err = collection.DeleteOne(context.Background(), filter)

	if err != nil {
		return err
	}

	return c.Status(200).JSON(fiber.Map{"success": true})
}
