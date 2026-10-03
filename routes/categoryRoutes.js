const express = require("express");

const Category = require("../models/Category");

const router = express.Router();


// ============================================
// GET ALL CATEGORIES
// ============================================

router.get("/", async (req, res) => {

    try {

        const categories = await Category
            .find()
            .sort({
                order: 1,
                createdAt: -1
            });

        res.status(200).json({
            success: true,
            count: categories.length,
            data: categories
        });

    } catch (error) {

        console.error(error);

        res.status(500).json({
            success: false,
            message: "Failed to fetch categories."
        });
    }
});


// ============================================
// GET SINGLE CATEGORY
// ============================================

router.get("/:id", async (req, res) => {

    try {

        const category =
            await Category.findById(req.params.id);

        if (!category) {

            return res.status(404).json({
                success: false,
                message: "Category not found."
            });
        }

        res.status(200).json({
            success: true,
            data: category
        });

    } catch (error) {

        res.status(500).json({
            success: false,
            message: "Failed to fetch category."
        });
    }
});


// ============================================
// CREATE CATEGORY
// ============================================

router.post("/", async (req, res) => {

    try {

        const {
            name,
            slug,
            type,
            description,
            icon,
            website,
            documentationUrl,
            version,
            status,
            order
        } = req.body;


        // ------------------------------
        // Required validation
        // ------------------------------

        if (!name || !slug || !type) {

            return res.status(400).json({
                success: false,
                message:
                    "Name, slug and type are required."
            });
        }


        // ------------------------------
        // Check duplicate name
        // ------------------------------

        const existingName =
            await Category.findOne({
                name: name.trim()
            });

        if (existingName) {

            return res.status(409).json({
                success: false,
                message:
                    "A category with this name already exists."
            });
        }


        // ------------------------------
        // Check duplicate slug
        // ------------------------------

        const existingSlug =
            await Category.findOne({
                slug: slug.trim().toLowerCase()
            });

        if (existingSlug) {

            return res.status(409).json({
                success: false,
                message:
                    "A category with this slug already exists."
            });
        }


        // ------------------------------
        // Create category
        // ------------------------------

        const category =
            await Category.create({

                name: name.trim(),

                slug: slug
                    .trim()
                    .toLowerCase(),

                type: type.trim(),

                description:
                    description?.trim() || "",

                icon:
                    icon?.trim() || "",

                website:
                    website?.trim() || "",

                documentationUrl:
                    documentationUrl?.trim() || "",

                version:
                    version?.trim() || "",

                status:
                    status || "active",

                order:
                    Number(order) || 0
            });


        res.status(201).json({
            success: true,
            message: "Category created successfully.",
            data: category
        });

    } catch (error) {

        console.error(error);

        res.status(500).json({
            success: false,
            message: "Failed to create category."
        });
    }
});


// ============================================
// UPDATE CATEGORY
// ============================================

router.put("/:id", async (req, res) => {

    try {

        const category =
            await Category.findByIdAndUpdate(
                req.params.id,
                req.body,
                {
                    new: true,
                    runValidators: true
                }
            );

        if (!category) {

            return res.status(404).json({
                success: false,
                message: "Category not found."
            });
        }

        res.status(200).json({
            success: true,
            message: "Category updated successfully.",
            data: category
        });

    } catch (error) {

        console.error(error);

        res.status(500).json({
            success: false,
            message: "Failed to update category."
        });
    }
});


// ============================================
// DELETE CATEGORY
// ============================================

router.delete("/:id", async (req, res) => {

    try {

        const category =
            await Category.findByIdAndDelete(
                req.params.id
            );

        if (!category) {

            return res.status(404).json({
                success: false,
                message: "Category not found."
            });
        }

        res.status(200).json({
            success: true,
            message: "Category deleted successfully."
        });

    } catch (error) {

        console.error(error);

        res.status(500).json({
            success: false,
            message: "Failed to delete category."
        });
    }
});


module.exports = router;