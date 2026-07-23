import Footer from "../../models/FooterModels/Footer.js";


/**
 * @desc Create Footer (Run only once)
 * @route POST /api/footer
 */
export const createFooter = async (req, res) => {
  try {
    // Check if footer already exists
    const existingFooter = await Footer.findOne();

    if (existingFooter) {
      return res.status(400).json({
        success: false,
        message: "Footer already exists. Please update it instead.",
      });
    }

    const {
      quickLinks,
      southAfricaOffice,
      zimbabweOffice,
      reviewWidget,
      copyright,
      designerName,
      designerLink,
      privacyPolicyLink,
    } = req.body;

    const footer = await Footer.create({
      logo: req.file ? req.file.path : "",

      quickLinks: quickLinks ? JSON.parse(quickLinks) : [],

      southAfricaOffice: southAfricaOffice ? JSON.parse(southAfricaOffice) : {},

      zimbabweOffice: zimbabweOffice ? JSON.parse(zimbabweOffice) : {},

      reviewWidget,

      copyright,

      designerName,

      designerLink,

      privacyPolicyLink,
    });

    res.status(201).json({
      success: true,
      message: "Footer created successfully.",
      footer,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/**
 * @desc Get Footer
 * @route GET /api/footer
 */
export const getFooter = async (req, res) => {
  try {
    const footer = await Footer.findOne();

    if (!footer) {
      return res.status(404).json({
        success: false,
        message: "Footer not found.",
      });
    }

    res.status(200).json({
      success: true,
      footer,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/**
 * @desc Update Footer
 * @route PUT /api/footer/:id
 */
export const updateFooter = async (req, res) => {
  try {
    const footer = await Footer.findById(req.params.id);

    if (!footer) {
      return res.status(404).json({
        success: false,
        message: "Footer not found.",
      });
    }

    if (req.file) {
      footer.logo = req.file.path;
    }

    if (req.body.quickLinks) {
      footer.quickLinks = JSON.parse(req.body.quickLinks);
    }

    if (req.body.southAfricaOffice) {
      footer.southAfricaOffice = JSON.parse(req.body.southAfricaOffice);
    }

    if (req.body.zimbabweOffice) {
      footer.zimbabweOffice = JSON.parse(req.body.zimbabweOffice);
    }

    if (req.body.reviewWidget !== undefined) {
      footer.reviewWidget = req.body.reviewWidget;
    }

    if (req.body.copyright !== undefined) {
      footer.copyright = req.body.copyright;
    }

    if (req.body.designerName !== undefined) {
      footer.designerName = req.body.designerName;
    }

    if (req.body.designerLink !== undefined) {
      footer.designerLink = req.body.designerLink;
    }

    if (req.body.privacyPolicyLink !== undefined) {
      footer.privacyPolicyLink = req.body.privacyPolicyLink;
    }

    await footer.save();

    res.status(200).json({
      success: true,
      message: "Footer updated successfully.",
      footer,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/**
 * @desc Delete Footer
 * @route DELETE /api/footer/:id
 */
export const deleteFooter = async (req, res) => {
  try {
    const footer = await Footer.findById(req.params.id);

    if (!footer) {
      return res.status(404).json({
        success: false,
        message: "Footer not found.",
      });
    }

    await footer.deleteOne();

    res.status(200).json({
      success: true,
      message: "Footer deleted successfully.",
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
