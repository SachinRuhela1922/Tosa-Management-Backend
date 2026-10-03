const express = require("express");

const Component = require("../models/Component");
const Category = require("../models/Category");

const router = express.Router();


// ============================================
// GET ALL COMPONENTS
// ============================================

router.get("/", async (req, res) => {

    try {

        const components =
            await Component
                .find()
                .populate(
                    "categoryId",
                    "name slug"
                )
                .sort({
                    order: 1,
                    createdAt: -1
                });

        res.status(200).json({
            success: true,
            count: components.length,
            data: components
        });

    } catch (error) {

        console.error(error);

        res.status(500).json({
            success: false,
            message:
                "Failed to fetch components."
        });
    }
});


// ============================================
// GET COMPONENTS BY CATEGORY
// ============================================

router.get(
    "/category/:categoryId",
    async (req, res) => {

        try {

            const { categoryId } =
                req.params;


            const category =
                await Category.findById(
                    categoryId
                );


            if (!category) {

                return res.status(404).json({
                    success: false,
                    message:
                        "Category not found."
                });
            }


            const components =
                await Component
                    .find({
                        categoryId
                    })
                    .sort({
                        order: 1,
                        createdAt: -1
                    });


            res.status(200).json({

                success: true,

                category: {
                    id: category._id,
                    name: category.name,
                    slug: category.slug
                },

                count: components.length,

                data: components

            });

        } catch (error) {

            console.error(error);

            res.status(500).json({
                success: false,
                message:
                    "Failed to fetch category components."
            });
        }
    }
);


// ============================================
// GET SINGLE COMPONENT
// ============================================

router.get("/:id", async (req, res) => {

    try {

        const component =
            await Component
                .findById(req.params.id)
                .populate(
                    "categoryId",
                    "name slug"
                );


        if (!component) {

            return res.status(404).json({
                success: false,
                message:
                    "Component not found."
            });
        }


        res.status(200).json({
            success: true,
            data: component
        });

    } catch (error) {

        console.error(error);

        res.status(500).json({
            success: false,
            message:
                "Failed to fetch component."
        });
    }
});


// ============================================
// CREATE COMPONENT
// ============================================

router.post("/", async (req, res) => {

    try {

        const {
            categoryId,
            name,
            slug,
            description,
            icon,
            status,
            order
        } = req.body;


        // ------------------------------------
        // Required fields
        // ------------------------------------

        if (
            !categoryId ||
            !name ||
            !slug
        ) {

            return res.status(400).json({
                success: false,
                message:
                    "Category, name and slug are required."
            });
        }


        // ------------------------------------
        // Check category
        // ------------------------------------

        const category =
            await Category.findById(
                categoryId
            );


        if (!category) {

            return res.status(404).json({
                success: false,
                message:
                    "Category not found."
            });
        }


        // ------------------------------------
        // Check duplicate component
        // ------------------------------------

        const existing =
            await Component.findOne({
                categoryId,
                slug:
                    slug
                        .trim()
                        .toLowerCase()
            });


        if (existing) {

            return res.status(409).json({
                success: false,
                message:
                    "This component already exists in this category."
            });
        }


        // ------------------------------------
        // Create component
        // ------------------------------------

        const component =
            await Component.create({

                categoryId,

                name:
                    name.trim(),

                slug:
                    slug
                        .trim()
                        .toLowerCase(),

                description:
                    description?.trim() || "",

                icon:
                    icon?.trim() || "",

                status:
                    status || "active",

                order:
                    Number(order) || 0
            });


        res.status(201).json({

            success: true,

            message:
                "Component created successfully.",

            data: component

        });

    } catch (error) {

        console.error(error);

        res.status(500).json({
            success: false,
            message:
                "Failed to create component."
        });
    }
});


// ============================================
// UPDATE COMPONENT
// ============================================

router.put("/:id", async (req, res) => {

    try {

        const component =
            await Component.findByIdAndUpdate(

                req.params.id,

                req.body,

                {
                    new: true,
                    runValidators: true
                }
            );


        if (!component) {

            return res.status(404).json({
                success: false,
                message:
                    "Component not found."
            });
        }


        res.status(200).json({

            success: true,

            message:
                "Component updated successfully.",

            data: component

        });

    } catch (error) {

        console.error(error);

        res.status(500).json({
            success: false,
            message:
                "Failed to update component."
        });
    }
});


// ============================================
// DELETE COMPONENT
// ============================================

router.delete("/:id", async (req, res) => {

    try {

        const component =
            await Component.findByIdAndDelete(
                req.params.id
            );


        if (!component) {

            return res.status(404).json({
                success: false,
                message:
                    "Component not found."
            });
        }


        res.status(200).json({

            success: true,

            message:
                "Component deleted successfully."

        });

    } catch (error) {

        console.error(error);

        res.status(500).json({
            success: false,
            message:
                "Failed to delete component."
        });
    }
});


module.exports = router;