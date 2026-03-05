// Elecian Build Tower Mod - Extended Range Script with Off-Screen Update Fix
// This script modifies the vanilla Build Tower range for extended construction support
// IMPORTANT: BuildTurret creates an internal UnitType with buildRange copied from range
// We need to modify BOTH range AND unitType.buildRange!
//
// OFF-SCREEN FIX: BuildTurrets outside camera view don't update due to game optimization.
// This mod forces them to update using Trigger.update event.

// Global reference to build tower block
let buildTowerBlock = null;
const RANGE_MULTIPLIER = 5;

Events.on(ContentInitEvent, () => {
    // Try to find the Build Tower block
    const possibleNames = ["build-tower", "buildTower", "build-turret"];

    buildTowerBlock = null;
    for (let name of possibleNames) {
        buildTowerBlock = Vars.content.blocks().find(b => b.name === name);
        if (buildTowerBlock != null) break;
    }

    if (buildTowerBlock != null) {
        // Store original range
        const originalRange = buildTowerBlock.range;

        // Set new range to 5x original
        buildTowerBlock.range = originalRange * RANGE_MULTIPLIER;

        // CRITICAL: Also modify the internal UnitType's buildRange
        // BuildTurret creates a UnitType with buildRange = range at init time
        if (buildTowerBlock.unitType != null) {
            const originalBuildRange = buildTowerBlock.unitType.buildRange;
            buildTowerBlock.unitType.buildRange = originalBuildRange * RANGE_MULTIPLIER;

            Log.info("[Elecian Build Tower Mod] Successfully modified build tower:");
            Log.info("  Block name: " + buildTowerBlock.name);
            Log.info("  Visual range: " + originalRange + " -> " + buildTowerBlock.range + " ticks (~" + (buildTowerBlock.range/4) + " tiles)");
            Log.info("  Build range: " + originalBuildRange + " -> " + buildTowerBlock.unitType.buildRange + " ticks (~" + (buildTowerBlock.unitType.buildRange/4) + " tiles)");
        } else {
            Log.info("[Elecian Build Tower Mod] Modified visual range only:");
            Log.info("  Block name: " + buildTowerBlock.name);
            Log.info("  Range: " + originalRange + " -> " + buildTowerBlock.range + " ticks");
            Log.warn("[Elecian Build Tower Mod] WARNING: unitType not found - effect range may not change!");
        }

        // OFF-SCREEN FIX: Set sync = true to force more frequent updates
        // This helps with network synchronization and may force updates even when off-screen
        try {
            buildTowerBlock.sync = true;
            Log.info("[Elecian Build Tower Mod] Enabled sync mode for off-screen updates");
        } catch (e) {
            Log.warn("[Elecian Build Tower Mod] Could not set sync mode: " + e);
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

// OFF-SCREEN UPDATE FIX - Alternative Approach 2
// Try using Events.run with Trigger.update and different iteration methods
// Also set block properties to force updates

Events.on(ContentInitEvent, () => {
    if (buildTowerBlock != null) {
        // Try setting various properties to force updates
        try {
            buildTowerBlock.update = true;
            Log.info("[Elecian Build Tower Mod] Set update = true");
        } catch(e) {}

        try {
            buildTowerBlock.sync = true;
            Log.info("[Elecian Build Tower Mod] Set sync = true");
        } catch(e) {}
    }

    // Method 1: Timer.schedule with longer interval
    Timer.schedule(run(() => {
        if (buildTowerBlock == null || Vars.state == null || !Vars.state.isPlaying()) return;

        let count = 0;
        Groups.build.each(cons(build => {
            if (build != null && build.block == buildTowerBlock) {
                count++;
                // Try multiple update methods
                try { build.updateTile(); } catch(e) {}
                try { if(build.unit) build.unit.updateBuildLogic(); } catch(e) {}
            }
        }));
        if (count > 0) {
            Log.info("[Elecian Build Tower Mod] Updated " + count + " build towers");
        }
    }), 0.5, 0.5); // Every 0.5 seconds to reduce spam but still frequent

    Log.info("[Elecian Build Tower Mod] Timer scheduled");
});

// Method 2: Also try Trigger.update with run()
Events.run(Trigger.update, () => {
    if (buildTowerBlock == null || Vars.state == null || !Vars.state.isPlaying()) return;

    Groups.build.each(cons(build => {
        if (build != null && build.block == buildTowerBlock) {
            try { build.updateTile(); } catch(e) {}
        }
    }));
});
