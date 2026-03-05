// Elecian Build Tower Mod - Extended Range Script
// This script modifies the vanilla Build Tower range for extended construction support
// IMPORTANT: BuildTurret creates an internal UnitType with buildRange copied from range
// We need to modify BOTH range AND unitType.buildRange!

Events.on(ContentInitEvent, () => {
    // Try to find the Build Tower block
    const possibleNames = ["build-tower", "buildTower", "build-turret"];

    let buildTower = null;
    for (let name of possibleNames) {
        buildTower = Vars.content.blocks().find(b => b.name === name);
        if (buildTower != null) break;
    }

    if (buildTower != null) {
        // Store original range
        const originalRange = buildTower.range;

        // Set new range to 5x original
        buildTower.range = originalRange * 5;

        // CRITICAL: Also modify the internal UnitType's buildRange
        // BuildTurret creates a UnitType with buildRange = range at init time
        if (buildTower.unitType != null) {
            const originalBuildRange = buildTower.unitType.buildRange;
            buildTower.unitType.buildRange = originalBuildRange * 5;

            Log.info("[Elecian Build Tower Mod] Successfully modified build tower:");
            Log.info("  Block name: " + buildTower.name);
            Log.info("  Visual range: " + originalRange + " -> " + buildTower.range + " ticks (~" + (buildTower.range/4) + " tiles)");
            Log.info("  Build range: " + originalBuildRange + " -> " + buildTower.unitType.buildRange + " ticks (~" + (buildTower.unitType.buildRange/4) + " tiles)");
        } else {
            Log.info("[Elecian Build Tower Mod] Modified visual range only:");
            Log.info("  Block name: " + buildTower.name);
            Log.info("  Range: " + originalRange + " -> " + buildTower.range + " ticks");
            Log.warn("[Elecian Build Tower Mod] WARNING: unitType not found - effect range may not change!");
        }
    } else {
        Log.warn("[Elecian Build Tower Mod] Could not find Build Tower block");
        Log.warn("[Elecian Build Tower Mod] Searching for blocks with 'build' in name...");

        Vars.content.blocks().each(b => {
            if (b.name != null && b.name.toLowerCase().contains("build")) {
                Log.warn("  Found: " + b.name);
            }
        });
    }
});
