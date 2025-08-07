import os
import importlib

package_name = __name__

modules = [
    f[:-3] for f in os.listdir(os.path.dirname(__file__))
    if f.endswith(".py") and f != "__init__.py"
]

__all__ = modules

for module in modules:
    globals()[module] = importlib.import_module(f"{package_name}.{module}")