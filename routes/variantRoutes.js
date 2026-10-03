const express = require("express");

const Variant = require("../models/Variant");
const Component = require("../models/Component");

const router = express.Router();


// GET ALL VARIANTS
router.get("/", async (req, res) => {
    try {
        const variants = await Variant.find()
            .populate("componentId", "name slug")
            .sort({ order: 1, createdAt: -1 });

        res.status(200).json({
            success: true,
            count: variants.length,
            data: variants
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
});


// GET VARIANTS OF COMPONENT
router.get("/component/:componentId", async (req, res) => {
    try {
        const component = await Component.findById(
            req.params.componentId
        );

        if (!component) {
            return res.status(404).json({
                success: false,
                message: "Component not found."
            });
        }

        const variants = await Variant.find({
            componentId: req.params.componentId
        }).sort({
            order: 1,
            createdAt: -1
        });

        res.status(200).json({
            success: true,
            component: {
                id: component._id,
                name: component.name,
                slug: component.slug
            },
            count: variants.length,
            data: variants
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
});


// GET SINGLE VARIANT
router.get("/:id", async (req, res) => {
    try {
        const variant = await Variant.findById(
            req.params.id
        ).populate("componentId", "name slug");

        if (!variant) {
            return res.status(404).json({
                success: false,
                message: "Variant not found."
            });
        }

        res.status(200).json({
            success: true,
            data: variant
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
});


// CREATE VARIANT
router.post("/", async (req, res) => {
    try {
        const {
            componentId,
            name,
            slug,
            description,
            shortDescription,
            installationCommand,
            usageCode,
            previewCode,
            folderStructure,
            tags,
            version,
            status,
            order,
            author
        } = req.body;

        if (!componentId || !name || !slug) {
            return res.status(400).json({
                success: false,
                message: "componentId, name and slug are required."
            });
        }

        const component = await Component.findById(componentId);

        if (!component) {
            return res.status(404).json({
                success: false,
                message: "Component not found."
            });
        }

        const existingVariant = await Variant.findOne({
            componentId,
            slug: slug.toLowerCase()
        });

        if (existingVariant) {
            return res.status(409).json({
                success: false,
                message: "Variant already exists in this component."
            });
        }

        const variant = await Variant.create({
            componentId,
            name,
            slug,
            description,
            shortDescription,
            installationCommand,
            usageCode,
            previewCode,
            folderStructure,
            tags,
            version,
            status,
            order,
            author
        });

        res.status(201).json({
            success: true,
            message: "Variant created successfully.",
            data: variant
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
});


// UPDATE VARIANT
router.put("/:id", async (req, res) => {
    try {
        const variant = await Variant.findByIdAndUpdate(
            req.params.id,
            req.body,
            {
                new: true,
                runValidators: true
            }
        );

        if (!variant) {
            return res.status(404).json({
                success: false,
                message: "Variant not found."
            });
        }

        res.status(200).json({
            success: true,
            message: "Variant updated successfully.",
            data: variant
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
});


// DELETE VARIANT
router.delete("/:id", async (req, res) => {
    try {
        const variant = await Variant.findByIdAndDelete(
            req.params.id
        );

        if (!variant) {
            return res.status(404).json({
                success: false,
                message: "Variant not found."
            });
        }

        res.status(200).json({
            success: true,
            message: "Variant deleted successfully."
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
});


module.exports = router;