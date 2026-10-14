
require("dotenv").config();

const express = require("express");
const cors = require("cors");
const swaggerUi = require("swagger-ui-express");
const pool = require("./db");

const app = express();

app.use(cors());
app.use(express.json());

// Import route files
const opportunitiesRoutes = require("./routes/opportunities");
const savedOpportunitiesRoutes = require("./routes/savedOpportunities");
const remindersRoutes = require("./routes/reminders");
const studentProfilesRoutes = require("./routes/studentProfiles");
const authRoutes = require("./routes/auth");

// Register API routes
app.use("/api/opportunities", opportunitiesRoutes);
app.use("/api/saved-opportunities", savedOpportunitiesRoutes);
app.use("/api/reminders", remindersRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/student-profiles", studentProfilesRoutes);

// Swagger API documentation
const swaggerDocument = {
  openapi: "3.0.0",

  info: {
    title: "MERIT-CORE API",
    version: "1.0.0",
    description:
      "API for managing opportunities, saved opportunities, reminders, and student profiles."
  },

  servers: [
    {
      url: "http://localhost:5000",
      description: "Local development server"
    }
  ],

  paths: {
    "/api/opportunities": {
      get: {
        summary: "Get all opportunities",
        tags: ["Opportunities"],
        responses: {
          200: {
            description: "List of opportunities"
          },
          500: {
            description: "Server error"
          }
        }
      },

      post: {
        summary: "Create an opportunity",
        tags: ["Opportunities"],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  title: {
                    type: "string"
                  },
                  description: {
                    type: "string"
                  },
                  organization_id: {
                    type: "integer"
                  },
                  deadline: {
                    type: "string",
                    format: "date"
                  },
                  location: {
                    type: "string"
                  },
                  type: {
                    type: "string"
                  },
                  eligibility: {
                    type: "string"
                  },
                  application_link: {
                    type: "string"
                  }
                }
              }
            }
          }
        },
        responses: {
          201: {
            description: "Opportunity created"
          },
          400: {
            description: "Invalid request"
          },
          500: {
            description: "Server error"
          }
        }
      }
    },

    "/api/opportunities/{id}": {
      parameters: [
        {
          name: "id",
          in: "path",
          required: true,
          schema: {
            type: "integer"
          },
          description: "Opportunity ID"
        }
      ],

      get: {
        summary: "Get an opportunity by ID",
        tags: ["Opportunities"],
        responses: {
          200: {
            description: "Opportunity found"
          },
          404: {
            description: "Opportunity not found"
          },
          500: {
            description: "Server error"
          }
        }
      },

      put: {
        summary: "Update an opportunity",
        tags: ["Opportunities"],
        responses: {
          200: {
            description: "Opportunity updated"
          },
          404: {
            description: "Opportunity not found"
          },
          500: {
            description: "Server error"
          }
        }
      },

      delete: {
        summary: "Delete an opportunity",
        tags: ["Opportunities"],
        responses: {
          200: {
            description: "Opportunity deleted"
          },
          404: {
            description: "Opportunity not found"
          },
          500: {
            description: "Server error"
          }
        }
      }
    },

    "/api/saved-opportunities": {
      get: {
        summary: "Get saved opportunities",
        tags: ["Saved Opportunities"],
        responses: {
          200: {
            description: "List of saved opportunities"
          },
          500: {
            description: "Server error"
          }
        }
      },

      post: {
        summary: "Save an opportunity",
        tags: ["Saved Opportunities"],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                required: ["user_id", "opportunity_id"],
                properties: {
                  user_id: {
                    type: "integer"
                  },
                  opportunity_id: {
                    type: "integer"
                  }
                }
              }
            }
          }
        },
        responses: {
          201: {
            description: "Opportunity saved"
          },
          400: {
            description: "Invalid request"
          },
          500: {
            description: "Server error"
          }
        }
      }
    },

    "/api/saved-opportunities/{id}": {
      parameters: [
        {
          name: "id",
          in: "path",
          required: true,
          schema: {
            type: "integer"
          },
          description: "Saved opportunity ID"
        }
      ],

      delete: {
        summary: "Remove a saved opportunity",
        tags: ["Saved Opportunities"],
        responses: {
          200: {
            description: "Saved opportunity removed"
          },
          404: {
            description: "Saved opportunity not found"
          },
          500: {
            description: "Server error"
          }
        }
      }
    },

    "/api/reminders": {
      get: {
        summary: "Get reminders",
        tags: ["Reminders"],
        responses: {
          200: {
            description: "List of reminders"
          },
          500: {
            description: "Server error"
          }
        }
      },

      post: {
        summary: "Create a reminder",
        tags: ["Reminders"],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  user_id: {
                    type: "integer"
                  },
                  opportunity_id: {
                    type: "integer"
                  },
                  reminder_date: {
                    type: "string",
                    format: "date-time"
                  },
                  message: {
                    type: "string"
                  }
                }
              }
            }
          }
        },
        responses: {
          201: {
            description: "Reminder created"
          },
          400: {
            description: "Invalid request"
          },
          500: {
            description: "Server error"
          }
        }
      }
    },

    "/api/reminders/{reminderId}": {
      parameters: [
        {
          name: "reminderId",
          in: "path",
          required: true,
          schema: {
            type: "integer"
          },
          description: "Reminder ID"
        }
      ],

      put: {
        summary: "Update a reminder",
        tags: ["Reminders"],
        responses: {
          200: {
            description: "Reminder updated"
          },
          404: {
            description: "Reminder not found"
          },
          500: {
            description: "Server error"
          }
        }
      },

      delete: {
        summary: "Delete a reminder",
        tags: ["Reminders"],
        responses: {
          200: {
            description: "Reminder deleted"
          },
          404: {
            description: "Reminder not found"
          },
          500: {
            description: "Server error"
          }
        }
      }
    },

    "/api/student-profiles/{userId}": {
      parameters: [
        {
          name: "userId",
          in: "path",
          required: true,
          schema: {
            type: "integer"
          },
          description: "Student user ID"
        }
      ],

      get: {
        summary: "Get a student profile",
        tags: ["Student Profiles"],
        responses: {
          200: {
            description: "Student profile retrieved"
          },
          404: {
            description: "Student profile not found"
          },
          500: {
            description: "Server error"
          }
        }
      },

      put: {
        summary: "Update a student profile",
        tags: ["Student Profiles"],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  institution: {
                    type: "string"
                  },
                  field_of_study: {
                    type: "string"
                  },
                  study_level: {
                    type: "string"
                  },
                  graduation_year: {
                    type: "integer"
                  },
                  gpa: {
                    type: "number"
                  },
                  skills: {
                    type: "array",
                    items: {
                      type: "string"
                    }
                  },
                  interests: {
                    type: "array",
                    items: {
                      type: "string"
                    }
                  }
                }
              }
            }
          }
        },
        responses: {
          200: {
            description: "Student profile updated"
          },
          404: {
            description: "Student profile not found"
          },
          500: {
            description: "Server error"
          }
        }
      }
    },

    "/api/student-profiles": {
      post: {
        summary: "Create a student profile",
        tags: ["Student Profiles"],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                required: ["user_id"],
                properties: {
                  user_id: {
                    type: "integer"
                  },
                  institution: {
                    type: "string"
                  },
                  field_of_study: {
                    type: "string"
                  },
                  study_level: {
                    type: "string"
                  },
                  graduation_year: {
                    type: "integer"
                  },
                  gpa: {
                    type: "number"
                  },
                  skills: {
                    type: "array",
                    items: {
                      type: "string"
                    }
                  },
                  interests: {
                    type: "array",
                    items: {
                      type: "string"
                    }
                  }
                }
              }
            }
          }
        },
        responses: {
          201: {
            description: "Student profile created"
          },
          400: {
            description: "Invalid request"
          },
          500: {
            description: "Server error"
          }
        }
      }
    }
  }
};

// Swagger documentation endpoint
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// Homepage
app.get("/", (req, res) => {
  res.send(`
    <!DOCTYPE html>
    <html>
      <head>
        <title>MERIT-CORE API</title>
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <style>
          body {
            font-family: Arial, sans-serif;
            max-width: 850px;
            margin: 40px auto;
            padding: 0 20px;
            line-height: 1.6;
          }
          h1 {
            color: #243b64;
          }
          li {
            margin-bottom: 8px;
          }
        </style>
      </head>
      <body>
        <h1>MERIT-CORE API is running</h1>
        <p>Use the links below to test the backend.</p>

        <ul>
          <li><a href="/api-docs">API documentation (Swagger)</a></li>
          <li><a href="/api/test-db">Test database connection</a></li>
          <li><a href="/api/opportunities">Opportunities</a></li>
          <li><a href="/api/saved-opportunities">Saved opportunities</a></li>
          <li><a href="/api/reminders">Reminders</a></li>
        </ul>
      </body>
    </html>
  `);
});

// Database connection test endpoint
app.get("/api/test-db", async (req, res) => {
  try {
    const result = await pool.query("SELECT NOW()");

    res.json({
      success: true,
      message: "Database connected successfully",
      time: result.rows[0].now
    });
  } catch (error) {
    console.error("Database connection test failed:", error.message);

    res.status(500).json({
      success: false,
      message: "Database connection failed"
    });
  }
});

// Start server
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`MERIT-CORE backend running on port ${PORT}`);
  console.log(`API documentation: http://localhost:${PORT}/api-docs`);
});
